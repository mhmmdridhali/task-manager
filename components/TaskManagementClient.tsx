"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Search, Pin, CalendarDays, CheckCircle2, Trash2,
    GripVertical, Pencil, Calendar, ArrowUpDown,
} from "lucide-react";
import type { Task, Priority, SortOption } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/types";
import { useTaskStore } from "@/lib/TaskContext";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/components/ThemeProvider";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";
import TaskInputField from "@/components/TaskInputField";
import ConfirmModal from "@/components/ConfirmModal";
import NeoButton from "@/components/ui/NeoButton";
import NeoInput from "@/components/ui/NeoInput";

// --- Sortable Task Item (inline for tight dnd-kit integration) ---
function SortableTaskItem({
    task, onToggle, onDelete, onEdit,
}: {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, updates: Partial<Pick<Task, "title" | "priority" | "categoryId" | "dueDate">>) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);
    const { categories } = useTaskStore();

    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleEditSubmit = () => {
        const trimmed = editValue.trim();
        if (trimmed && trimmed !== task.title) onEdit(task.id, { title: trimmed });
        else setEditValue(task.title);
        setIsEditing(false);
    };

    const priority = PRIORITY_CONFIG[task.priority];
    const category = categories.find((c) => c.id === task.categoryId);
    const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        flex items-start gap-2 p-3 neo-border neo-shadow-sm bg-neo-white transition-all duration-200
        ${isDragging ? "opacity-50 scale-[1.02] z-50 shadow-lg" : ""}
        ${task.completed ? "opacity-50" : "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--neo-black)]"}
      `}
        >
            <button
                {...attributes}
                {...listeners}
                className="w-6 h-6 flex items-center justify-center text-neo-black/30 hover:text-neo-black cursor-grab active:cursor-grabbing flex-shrink-0 mt-0.5 touch-none"
                aria-label="Drag to reorder"
            >
                <GripVertical size={14} strokeWidth={2.5} />
            </button>

            <div className={`w-1 self-stretch flex-shrink-0 ${priority.color}`} />

            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="neo-checkbox mt-0.5"
            />

            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleEditSubmit}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleEditSubmit();
                            if (e.key === "Escape") { setEditValue(task.title); setIsEditing(false); }
                        }}
                        className="w-full px-2 py-1 font-sans text-sm bg-transparent neo-border focus:outline-none focus:border-[var(--neo-cyan)]"
                        autoFocus
                    />
                ) : (
                    <p
                        className={`font-sans text-sm cursor-pointer truncate ${task.completed ? "task-completed" : "text-neo-black"}`}
                        onClick={() => !task.completed && setIsEditing(true)}
                        title={task.completed ? task.title : "Klik untuk mengedit"}
                    >
                        {task.title}
                    </p>
                )}
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-heading font-bold neo-border ${priority.color}`}>
                        {priority.label}
                    </span>
                    {category && (
                        <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-heading font-bold neo-border ${category.color}`}>
                            {category.name}
                        </span>
                    )}
                    {task.dueDate && (
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-heading font-bold neo-border ${isOverdue ? "bg-neo-red text-neo-white" : "bg-neo-white"
                            }`}>
                            <Calendar size={9} strokeWidth={3} />
                            {new Date(task.dueDate + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </span>
                    )}
                    {isOverdue && (
                        <span className="px-1.5 py-0.5 text-[10px] font-heading font-bold neo-border bg-neo-red text-neo-white">Terlambat</span>
                    )}
                    {task.completed && (
                        <span className="px-1.5 py-0.5 text-[10px] font-heading font-bold neo-border bg-neo-green">Selesai</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
                {!task.completed && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="w-7 h-7 flex items-center justify-center neo-border bg-neo-cyan/30 hover:bg-neo-cyan transition-colors cursor-pointer" aria-label="Edit">
                        <Pencil size={12} strokeWidth={2.5} />
                    </button>
                )}
                <button onClick={() => onDelete(task.id)} className="w-7 h-7 flex items-center justify-center neo-border bg-neo-red/30 hover:bg-neo-red transition-colors cursor-pointer" aria-label="Hapus">
                    <Trash2 size={12} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

// --- Main Task Management Page ---
type TaskTab = "all" | "active" | "completed";

export default function TaskManagementClient() {
    const {
        tasks, addTask, toggleTask, deleteTask, restoreTask,
        editTask, clearCompleted, restoreTasks, reorderTasks,
        activeCount, completedCount, fetchTasks
    } = useTaskStore();
    const { addToast } = useToast();
    const { toggleTheme } = useTheme();
    const [tab, setTab] = useState<TaskTab>("all");
    const [sort, setSort] = useState<SortOption>("newest");
    const [searchQuery, setSearchQuery] = useState("");
    const [showAllInTab, setShowAllInTab] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; taskId: string; taskTitle: string }>({ isOpen: false, taskId: "", taskTitle: "" });
    const searchRef = useRef<HTMLInputElement>(null);

    useKeyboardShortcuts({
        onSearch: () => searchRef.current?.focus(),
        onToggleTheme: toggleTheme,
    });

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Sensors for dnd-kit — pointer with 5px activation distance + touch + keyboard
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleAddTask = (title: string, priority: Priority, categoryId?: string, dueDate?: string) => {
        addTask(title, priority, categoryId, dueDate);
        addToast("Tugas baru ditambahkan!", "success");
    };

    const handleToggle = (id: string) => {
        const task = tasks.find((t) => t.id === id);
        toggleTask(id);
        if (task) addToast(task.completed ? "Tugas diaktifkan" : "Tugas selesai!", "success");
    };

    const requestDelete = (id: string) => {
        const task = tasks.find((t) => t.id === id);
        setDeleteModal({ isOpen: true, taskId: id, taskTitle: task?.title || "" });
    };

    const confirmDelete = async () => {
        const deleted = await deleteTask(deleteModal.taskId);
        if (deleted) {
            addToast(`"${deleted.title}" dihapus`, "info", () => {
                restoreTask(deleted);
                addToast("Tugas dikembalikan!", "success");
            });
        }
        setDeleteModal({ isOpen: false, taskId: "", taskTitle: "" });
    };

    const handleEdit = (id: string, updates: Partial<Pick<Task, "title" | "priority" | "categoryId" | "dueDate">>) => {
        editTask(id, updates);
        addToast("Tugas diperbarui!", "success");
    };

    const handleClearCompleted = async () => {
        const cleared = await clearCompleted();
        if (cleared.length > 0) {
            addToast(`${cleared.length} tugas dihapus`, "info", () => {
                restoreTasks(cleared);
                addToast("Tugas dikembalikan!", "success");
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            reorderTasks(active.id as string, over.id as string);
            addToast("Urutan diperbarui", "success");
        }
    };

    // Tab filtering
    const tabData = useMemo(() => ({
        all: tasks,
        active: tasks.filter((t) => !t.completed),
        completed: tasks.filter((t) => t.completed),
    }), [tasks]);

    const currentTasks = useMemo(() => {
        let result = [...tabData[tab]];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((t) => t.title.toLowerCase().includes(q));
        }
        if (sort === "newest") result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        else if (sort === "oldest") result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        else if (sort === "priority") {
            const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
            result.sort((a, b) => order[a.priority] - order[b.priority]);
        }
        else if (sort === "alphabetical") result.sort((a, b) => a.title.localeCompare(b.title));
        return result;
    }, [tabData, tab, searchQuery, sort]);

    const ITEMS = 10;
    const displayed = showAllInTab ? currentTasks : currentTasks.slice(0, ITEMS);
    const hasMore = currentTasks.length > ITEMS && !showAllInTab;

    const tabs: { key: TaskTab; label: string; count: number; icon: React.ReactNode }[] = [
        { key: "all", label: "Semua", count: tasks.length, icon: <ArrowUpDown size={14} strokeWidth={2.5} /> },
        { key: "active", label: "Aktif", count: activeCount, icon: <Pin size={14} strokeWidth={2.5} /> },
        { key: "completed", label: "Selesai", count: completedCount, icon: <CheckCircle2 size={14} strokeWidth={2.5} /> },
    ];

    const sortOptions: { key: SortOption; label: string }[] = [
        { key: "newest", label: "Terbaru" },
        { key: "oldest", label: "Terlama" },
        { key: "priority", label: "Prioritas" },
        { key: "alphabetical", label: "A-Z" },
    ];

    return (
        <main className="p-6 md:p-10 max-w-4xl">
            <div className="mb-6">
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-neo-black mb-1">Manajemen Tugas</h1>
                <p className="font-sans text-base text-neo-black/50">Kelola, urutkan, dan organisir semua tugasmu</p>
            </div>

            <TaskInputField onAddTask={handleAddTask} />

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                    <Search size={16} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black/30 pointer-events-none" />
                    <NeoInput ref={searchRef} placeholder="Cari tugas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <div className="flex items-center gap-1">
                    {sortOptions.map((s) => (
                        <button
                            key={s.key}
                            onClick={() => setSort(s.key)}
                            className={`px-3 py-2 text-xs font-heading font-bold neo-border transition-all cursor-pointer ${sort === s.key ? "bg-neo-yellow neo-shadow-sm" : "bg-neo-white hover:bg-neo-gray shadow-none"
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((t) => (
                    <NeoButton
                        key={t.key}
                        variant={tab === t.key ? "yellow" : "white"}
                        className={`text-sm px-4 py-2 ${tab === t.key ? "" : "opacity-70 hover:opacity-100"}`}
                        onClick={() => { setTab(t.key); setShowAllInTab(false); }}
                    >
                        {t.icon}
                        <span className="ml-1">{t.label}</span>
                        <span className="ml-1 inline-flex items-center justify-center w-6 h-6 neo-border bg-neo-white text-xs font-bold">{t.count}</span>
                    </NeoButton>
                ))}
            </div>

            {/* Drag-and-Drop Task List */}
            {displayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CheckCircle2 size={48} strokeWidth={1.5} className="text-neo-black/20 mb-4" />
                    <h3 className="font-heading text-2xl font-bold text-neo-black mb-2">Belum ada tugas</h3>
                    <p className="font-sans text-base text-neo-black/50 max-w-sm">Mulai dengan menambahkan tugas pertama di kolom atas.</p>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={displayed.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-2">
                            {displayed.map((task) => (
                                <SortableTaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={handleToggle}
                                    onDelete={requestDelete}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {hasMore && (
                <div className="mt-4 text-center">
                    <NeoButton variant="white" className="text-sm px-6 py-2" onClick={() => setShowAllInTab(true)}>
                        Lihat {currentTasks.length - ITEMS} tugas lainnya
                    </NeoButton>
                </div>
            )}

            {tasks.length > 0 && (
                <div className="mt-8 pt-4 border-t-2 border-neo-black/10 flex items-center justify-between">
                    <p className="font-sans text-sm text-neo-black/40">{completedCount} dari {tasks.length} tugas selesai</p>
                    {completedCount > 0 && (
                        <button onClick={handleClearCompleted} className="flex items-center gap-1 font-sans text-sm text-neo-red/70 hover:text-neo-red transition-colors cursor-pointer">
                            <Trash2 size={12} strokeWidth={2.5} /> Hapus yang selesai
                        </button>
                    )}
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Hapus Tugas?"
                message={`Yakin mau hapus "${deleteModal.taskTitle}"? Kamu bisa membatalkan lewat tombol Undo.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModal({ isOpen: false, taskId: "", taskTitle: "" })}
            />
        </main>
    );
}
