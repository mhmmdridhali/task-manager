"use client";

import { create } from "zustand";
import type { Task, Filter, SortOption, Priority, Category } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { getLocalTodayStr } from "@/lib/dateUtils";

function todayStr() {
    return getLocalTodayStr();
}

// Ensure the local ID temporarily looks like a UUID for UI consistency until DB replaces it
function tempUid(): string {
    return typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `12345678-1234-1234-1234-${Date.now().toString().slice(-12)}`;
}

interface TaskState {
    tasks: Task[];
    filter: Filter;
    sort: SortOption;
    searchQuery: string;
    isInitialized: boolean;
    categories: Category[];
    isCategoriesInitialized: boolean;

    // UI actions
    setFilter: (f: Filter) => void;
    setSort: (s: SortOption) => void;
    setSearchQuery: (q: string) => void;

    // Async DB Actions
    fetchTasks: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    addCategory: (name: string, color: string) => Promise<void>;
    editCategory: (id: string, name: string, color: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<Category | undefined>;
    restoreCategory: (category: Category) => Promise<void>;
    addTask: (title: string, priority?: Priority, categoryId?: string, dueDate?: string) => Promise<void>;
    addTaskToList: (title: string, listId: string, priority?: Priority, categoryId?: string, dueDate?: string) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    deleteTask: (id: string) => Promise<Task | undefined>;
    restoreTask: (task: Task) => Promise<void>;
    editTask: (id: string, updates: Partial<Pick<Task, "title" | "priority" | "categoryId" | "dueDate">>) => Promise<void>;
    moveTaskToList: (taskId: string, targetListId: string, targetPosition: number) => Promise<void>;
    clearCompleted: () => Promise<Task[]>;
    restoreTasks: (tasks: Task[]) => Promise<void>;
    reorderTasks: (activeId: string, overId: string) => Promise<void>;

    // Computed Getters
    activeCount: number;
    completedCount: number;
    getBoardTasks: () => Record<string, Task[]>;
}

export const useTaskStore = create<TaskState>((set, get) => {
    const supabase = createClient();

    // Helper to sync DB task to UI task
    const mapDbToTask = (row: any): Task => ({
        id: row.id,
        title: row.title,
        completed: row.completed,
        priority: row.priority as Priority,
        categoryId: row.category_id || undefined,
        listId: row.status === 'done' || row.completed ? 'done' : 'todo',
        description: row.description || undefined,
        dueDate: row.due_date || undefined,
        createdAt: row.created_at,
        position: row.position,
    });

    const mapDbToCategory = (row: any): Category => ({
        id: row.id,
        name: row.name,
        color: row.color,
    });

    return {
        tasks: [],
        filter: "all",
        sort: "newest",
        searchQuery: "",
        isInitialized: false,
        categories: [],
        isCategoriesInitialized: false,

        setFilter: (f) => set({ filter: f }),
        setSort: (s) => set({ sort: s }),
        setSearchQuery: (q) => set({ searchQuery: q }),

        fetchTasks: async () => {
            if (get().isInitialized) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('position', { ascending: true });

            if (!error && data) {
                set({ tasks: data.map(mapDbToTask), isInitialized: true });
            }
        },

        fetchCategories: async () => {
            if (get().isCategoriesInitialized) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: true });

            if (!error && data) {
                set({ categories: data.map(mapDbToCategory), isCategoriesInitialized: true });
            }
        },

        addCategory: async (name, color) => {
            const tempId = tempUid();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const newCategory = { id: tempId, name, color };
            set(state => ({ categories: [...state.categories, newCategory] }));

            const { data, error } = await supabase.from('categories').insert([{
                user_id: user.id,
                name,
                color
            }]).select().single();

            if (error) {
                set(state => ({ categories: state.categories.filter(c => c.id !== tempId) }));
            } else {
                set(state => ({
                    categories: state.categories.map(c => c.id === tempId ? mapDbToCategory(data) : c)
                }));
            }
        },

        editCategory: async (id, name, color) => {
            set(state => ({
                categories: state.categories.map(c => c.id === id ? { ...c, name, color } : c)
            }));
            await supabase.from('categories').update({ name, color }).eq('id', id);
        },

        deleteCategory: async (id) => {
            const cat = get().categories.find(c => c.id === id);
            if (!cat) return undefined;
            set(state => ({
                categories: state.categories.filter(c => c.id !== id)
            }));
            await supabase.from('categories').delete().eq('id', id);
            return cat;
        },

        restoreCategory: async (category) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            set(state => ({
                categories: [...state.categories, category]
            }));

            await supabase.from('categories').insert([{
                id: category.id.length === 36 ? category.id : undefined,
                user_id: user.id,
                name: category.name,
                color: category.color
            }]);
        },

        addTask: async (title, priority = "medium", categoryId, dueDate) => {
            const tempId = tempUid();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const newTask: Task = {
                id: tempId, title, completed: false, priority,
                categoryId, dueDate, listId: "todo",
                createdAt: new Date().toISOString(), position: 0,
            };

            // Optimistic UI
            set(state => {
                const inTodo = state.tasks.filter((t) => t.listId === "todo");
                const others = state.tasks.filter((t) => t.listId !== "todo");
                return {
                    tasks: [newTask, ...inTodo.map((t) => ({ ...t, position: t.position + 1 })), ...others]
                };
            });

            // Remote Call
            const { data, error } = await supabase.from('tasks').insert([{
                user_id: user.id,
                title,
                priority,
                status: 'todo',
                category_id: categoryId || null,
                due_date: dueDate || null,
                position: 0
            }]).select().single();

            if (error) {
                // Revert
                set(state => ({ tasks: state.tasks.filter(t => t.id !== tempId) }));
            } else {
                // Confirm ID
                set(state => ({
                    tasks: state.tasks.map(t => t.id === tempId ? mapDbToTask(data) : t)
                }));
            }
        },

        addTaskToList: async (title, listId, priority = "medium", categoryId, dueDate) => {
            const tempId = tempUid();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const targetListId = listId === "overdue" ? "todo" : listId;
            const newTask: Task = {
                id: tempId, title, completed: targetListId === "done", priority,
                categoryId, dueDate, listId: targetListId,
                createdAt: new Date().toISOString(), position: 0,
            };

            set(state => {
                const inList = state.tasks.filter((t) => t.listId === targetListId);
                const others = state.tasks.filter((t) => t.listId !== targetListId);
                return {
                    tasks: [...others, newTask, ...inList.map((t) => ({ ...t, position: t.position + 1 }))]
                };
            });

            const { data, error } = await supabase.from('tasks').insert([{
                user_id: user.id,
                title,
                priority,
                status: targetListId === 'done' ? 'done' : 'todo',
                completed: targetListId === 'done',
                category_id: categoryId || null,
                due_date: dueDate || null,
                position: 0
            }]).select().single();

            if (error) {
                set(state => ({ tasks: state.tasks.filter(t => t.id !== tempId) }));
            } else {
                set(state => ({
                    tasks: state.tasks.map(t => t.id === tempId ? mapDbToTask(data) : t)
                }));
            }
        },

        toggleTask: async (id) => {
            const task = get().tasks.find(t => t.id === id);
            if (!task) return;

            const newCompleted = !task.completed;
            const newStatus = newCompleted ? 'done' : 'todo';

            set(state => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, completed: newCompleted, listId: newStatus } : t)
            }));

            await supabase.from('tasks').update({
                completed: newCompleted,
                status: newStatus
            }).eq('id', id);
        },

        deleteTask: async (id) => {
            const task = get().tasks.find(t => t.id === id);
            if (!task) return undefined;

            set(state => ({
                tasks: state.tasks.filter(t => t.id !== id)
            }));

            await supabase.from('tasks').delete().eq('id', id);
            return task;
        },

        restoreTask: async (task) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            set(state => ({
                tasks: [...state.tasks, task].sort((a, b) => a.position - b.position)
            }));

            // Make sure to remove the old ID so it gets a fresh one inserted if necessary, 
            // or re-insert with the same ID if Supabase permits (it usually does for UUIDs).
            await supabase.from('tasks').insert([{
                id: task.id.length === 36 ? task.id : undefined, // only pass valid UUID
                user_id: user.id,
                title: task.title,
                priority: task.priority,
                status: task.listId === 'done' ? 'done' : 'todo',
                completed: task.completed,
                category_id: task.categoryId || null,
                due_date: task.dueDate || null,
                position: task.position
            }]);
        },

        editTask: async (id, updates) => {
            set(state => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
            }));

            const dbUpdates: any = {};
            if (updates.title !== undefined) dbUpdates.title = updates.title;
            if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
            if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
            if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;

            if (Object.keys(dbUpdates).length > 0) {
                await supabase.from('tasks').update(dbUpdates).eq('id', id);
            }
        },

        moveTaskToList: async (taskId, targetListId, targetPosition) => {
            const realTarget = targetListId === "overdue" ? "todo" : targetListId;
            let updatedTasks: Task[] = [];

            set(state => {
                const task = state.tasks.find(t => t.id === taskId);
                if (!task) return state;

                const updated = state.tasks.map(t => {
                    if (t.id === taskId) {
                        return { ...t, listId: realTarget, position: targetPosition, completed: realTarget === "done" };
                    }
                    return t;
                });

                const inTarget = updated.filter(t => t.listId === realTarget).sort((a, b) => a.position - b.position);
                updatedTasks = updated.map(t => {
                    if (t.listId === realTarget) {
                        const idx = inTarget.findIndex(x => x.id === t.id);
                        return { ...t, position: idx };
                    }
                    return t;
                });

                return { tasks: updatedTasks };
            });

            // Remote Sync
            await supabase.from('tasks').update({
                status: realTarget === 'done' ? 'done' : 'todo',
                completed: realTarget === 'done',
                position: targetPosition
            }).eq('id', taskId);

            // Re-sync positions for other tasks in bulk (simplified)
            // Note: For a robust drag-and-drop, you typically want a bulk update.
            // Using RPC or separate updates. In this mock version, we update the main one.
        },

        clearCompleted: async () => {
            const cleared = get().tasks.filter(t => t.completed);
            set(state => ({
                tasks: state.tasks.filter(t => !t.completed)
            }));

            if (cleared.length > 0) {
                await supabase.from('tasks').delete().in('id', cleared.map(t => t.id));
            }
            return cleared;
        },

        restoreTasks: async (tasks) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            set(state => {
                const ids = new Set(state.tasks.map(t => t.id));
                return {
                    tasks: [...state.tasks, ...tasks.filter(t => !ids.has(t.id))].sort((a, b) => a.position - b.position)
                };
            });

            const inserts = tasks.map(t => ({
                id: t.id.length === 36 ? t.id : undefined,
                user_id: user.id,
                title: t.title,
                priority: t.priority,
                status: t.listId === 'done' ? 'done' : 'todo',
                completed: t.completed,
                category_id: t.categoryId || null,
                due_date: t.dueDate || null,
                position: t.position
            }));

            await supabase.from('tasks').insert(inserts);
        },

        reorderTasks: async (activeId, overId) => {
            let newArray: Task[] = [];
            set(state => {
                const oldIndex = state.tasks.findIndex(t => t.id === activeId);
                const newIndex = state.tasks.findIndex(t => t.id === overId);
                if (oldIndex === -1 || newIndex === -1) return state;

                const result = [...state.tasks];
                const [moved] = result.splice(oldIndex, 1);
                result.splice(newIndex, 0, moved);

                newArray = result.map((t, i) => ({ ...t, position: i }));
                return { tasks: newArray };
            });

            // Remote Sync (Target only the moved entry to save API calls for this demo)
            const movedTask = newArray.find(t => t.id === activeId);
            if (movedTask) {
                await supabase.from('tasks').update({ position: movedTask.position }).eq('id', activeId);
            }
        },

        get activeCount() {
            return get().tasks.filter(t => !t.completed).length;
        },

        get completedCount() {
            return get().tasks.filter(t => t.completed).length;
        },

        getBoardTasks: () => {
            const tasks = get().tasks;
            const today = todayStr();
            const map: Record<string, Task[]> = { overdue: [], todo: [], done: [] };
            tasks.forEach((t) => {
                if (t.completed || t.listId === "done") {
                    map.done.push(t);
                } else if (t.dueDate && t.dueDate < today) {
                    map.overdue.push(t);
                } else {
                    map.todo.push(t);
                }
            });
            Object.keys(map).forEach((k) => map[k].sort((a, b) => a.position - b.position));
            return map;
        }
    };
});
