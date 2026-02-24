"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Trash2 } from "lucide-react";
import type { Task, BoardList } from "@/lib/types";
import KanbanCard from "@/components/KanbanCard";

interface KanbanColumnProps {
    list: BoardList;
    tasks: Task[];
    onEditTask: (id: string, updates: Partial<Pick<Task, "title" | "priority" | "categoryId" | "dueDate">>) => void;
    onDeleteTask: (id: string) => void;
    onClearDone?: () => void;
}

export default function KanbanColumn({ list, tasks, onEditTask, onDeleteTask, onClearDone }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: `column-${list.id}` });

    return (
        <div className={`flex flex-col flex-1 min-w-[280px] max-w-md flex-shrink-0 neo-border bg-neo-bg transition-all duration-200 ${isOver ? "ring-2 ring-neo-cyan ring-offset-2" : ""}`}>
            {/* Header: title + count + optional clear action */}
            <div className={`p-3 border-b-[3px] border-neo-black ${list.color} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-neo-black">{list.title}</h3>
                    <span className="w-6 h-6 flex items-center justify-center neo-border bg-neo-white text-[10px] font-heading font-bold">{tasks.length}</span>
                </div>
                {onClearDone && tasks.length > 0 && (
                    <button onClick={onClearDone}
                        className="w-7 h-7 flex items-center justify-center neo-border bg-neo-white hover:bg-neo-red/20 text-neo-red transition-colors cursor-pointer"
                        aria-label="Hapus semua selesai">
                        <Trash2 size={14} strokeWidth={3} />
                    </button>
                )}
            </div>

            {/* Cards */}
            <div ref={setNodeRef} className="flex-1 p-2 space-y-1.5 min-h-[80px] overflow-y-auto max-h-[calc(100vh-280px)]">
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <KanbanCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
                    ))}
                </SortableContext>
                {tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <p className="font-sans text-xs text-neo-black/30">Belum ada kartu</p>
                    </div>
                )}
            </div>
        </div>
    );
}
