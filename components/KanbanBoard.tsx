"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import {
    DndContext, DragOverlay, closestCorners,
    KeyboardSensor, PointerSensor, TouchSensor,
    useSensor, useSensors,
    type DragStartEvent, type DragOverEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Columns3, Trash2 } from "lucide-react";
import type { Task, Priority } from "@/lib/types";
import { DEFAULT_LISTS } from "@/lib/types";
import { useTaskStore } from "@/lib/TaskContext";
import { useToast } from "@/components/ToastProvider";
import KanbanColumn from "@/components/KanbanColumn";
import KanbanCard from "@/components/KanbanCard";
import ConfirmModal from "@/components/ConfirmModal";

export default function KanbanBoard() {
    const { tasks, editTask, deleteTask, restoreTask, moveTaskToList, getBoardTasks, clearCompleted, restoreTasks, fetchTasks } = useTaskStore();
    const { addToast } = useToast();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeTaskFrom, setActiveTaskFrom] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; taskId: string; taskTitle: string }>({ isOpen: false, taskId: "", taskTitle: "" });
    const [clearModal, setClearModal] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const boardTasks = useMemo(() => getBoardTasks(), [getBoardTasks, tasks]);
    const doneCount = (boardTasks.done || []).length;

    const findListId = useCallback((id: string): string | null => {
        if (id.startsWith("column-")) return id.replace("column-", "");
        for (const [listId, listTasks] of Object.entries(boardTasks)) {
            if (listTasks.find((t) => t.id === id)) return listId;
        }
        return null;
    }, [boardTasks]);

    const handleDragStart = (e: DragStartEvent) => {
        setActiveTask(tasks.find((t) => t.id === e.active.id) || null);
        setActiveTaskFrom(findListId(e.active.id as string));
    };
    const handleDragOver = (e: DragOverEvent) => {
        const { active, over } = e;
        if (!over) return;
        const from = findListId(active.id as string);
        const to = findListId(over.id as string);
        if (!from || !to || from === to) return;
        const overTasks = boardTasks[to] || [];
        const idx = overTasks.findIndex((t) => t.id === over.id);
        moveTaskToList(active.id as string, to, idx >= 0 ? idx : overTasks.length);
    };
    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        const currentTo = findListId(active.id as string);
        if (activeTaskFrom !== "done" && currentTo === "done") {
            const t = tasks.find(x => x.id === active.id);
            addToast(`Tugas "${t?.title}" terselesaikan!`, "success", () => {
                moveTaskToList(active.id as string, activeTaskFrom || "todo", 0);
                addToast("Tugas dikembalikan", "info");
            });
        }

        setActiveTaskFrom(null);
        setActiveTask(null);

        if (!over || active.id === over.id) return;
        const from = findListId(active.id as string);
        const to = findListId(over.id as string);
        if (!from || !to) return;
        if (from === to) {
            const idx = (boardTasks[from] || []).findIndex((t) => t.id === over.id);
            if (idx !== -1) moveTaskToList(active.id as string, from, idx);
        }
    };

    const handleEdit = (id: string, updates: Partial<Pick<Task, "title" | "priority" | "categoryId" | "dueDate">>) => {
        editTask(id, updates);
    };

    const reqDelete = (id: string) => {
        const t = tasks.find((x) => x.id === id);
        setDeleteModal({ isOpen: true, taskId: id, taskTitle: t?.title || "" });
    };
    const confirmDel = async () => {
        const d = await deleteTask(deleteModal.taskId);
        if (d) addToast(`"${d.title}" dihapus`, "info", () => { restoreTask(d); addToast("Dikembalikan!", "success"); });
        setDeleteModal({ isOpen: false, taskId: "", taskTitle: "" });
    };

    const handleClearDone = async () => {
        const cleared = await clearCompleted();
        if (cleared.length > 0) {
            addToast(`${cleared.length} tugas selesai dihapus`, "info", () => {
                restoreTasks(cleared);
                addToast("Dikembalikan!", "success");
            });
        }
        setClearModal(false);
    };

    return (
        <main className="p-6 md:p-10 h-full max-w-7xl mx-auto w-full">
            <div className="mb-6">
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-neo-black mb-1 flex items-center gap-2">
                    <Columns3 size={32} strokeWidth={2.5} />
                    Kanban Board
                </h1>
                <p className="font-sans text-base text-neo-black/60">Drag kartu antar kolom untuk mengubah status tugas</p>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2" style={{ minHeight: "400px" }}>
                    {DEFAULT_LISTS.map((list) => (
                        <KanbanColumn
                            key={list.id}
                            list={list}
                            tasks={boardTasks[list.id] || []}
                            onEditTask={handleEdit}
                            onDeleteTask={reqDelete}
                            onClearDone={list.id === "done" ? () => setClearModal(true) : undefined}
                        />
                    ))}
                </div>
                <DragOverlay dropAnimation={null}>
                    {activeTask ? <KanbanCard task={activeTask} onEdit={() => { }} onDelete={() => { }} isDragOverlay /> : null}
                </DragOverlay>
            </DndContext>
            <ConfirmModal isOpen={deleteModal.isOpen} title="Hapus Kartu?" message={`Yakin mau hapus "${deleteModal.taskTitle}"?`} onConfirm={confirmDel} onCancel={() => setDeleteModal({ isOpen: false, taskId: "", taskTitle: "" })} />
            <ConfirmModal isOpen={clearModal} title="Hapus Semua Tugas Selesai?" message={`${doneCount} tugas selesai akan dihapus. Anda bisa Undo lewat toast.`} onConfirm={handleClearDone} onCancel={() => setClearModal(false)} />
        </main>
    );
}
