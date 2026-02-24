"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Calendar } from "lucide-react";
import type { Task } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/types";
import { useTaskStore } from "@/lib/TaskContext";

interface TaskItemCardProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, newTitle: string) => void;
}

export default function TaskItemCard({
    task,
    onToggle,
    onDelete,
    onEdit,
}: TaskItemCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);
    const { categories } = useTaskStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleEditSubmit = () => {
        const trimmed = editValue.trim();
        if (trimmed && trimmed !== task.title) {
            onEdit(task.id, trimmed);
        } else {
            setEditValue(task.title);
        }
        setIsEditing(false);
    };

    const priority = PRIORITY_CONFIG[task.priority];
    const category = categories.find((c) => c.id === task.categoryId);
    const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
    const isDueToday = task.dueDate && !task.completed && new Date(task.dueDate).toDateString() === new Date().toDateString();

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        flex items-start gap-2 p-3 neo-border neo-shadow-sm bg-neo-white
        transition-all duration-200
        ${isDragging ? "opacity-50 scale-[1.02] z-50" : ""}
        ${task.completed ? "opacity-50" : "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--neo-black)]"}
      `}
        >
            {/* Drag handle */}
            <button
                {...attributes}
                {...listeners}
                className="w-6 h-6 flex items-center justify-center text-neo-black/30 hover:text-neo-black cursor-grab active:cursor-grabbing flex-shrink-0 mt-0.5"
                aria-label="Drag to reorder"
            >
                <GripVertical size={14} strokeWidth={2.5} />
            </button>

            {/* Priority indicator */}
            <div className={`w-1 self-stretch flex-shrink-0 ${priority.color}`} />

            {/* Checkbox */}
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="neo-checkbox mt-0.5"
                aria-label={`Tandai "${task.title}" selesai`}
            />

            {/* Content */}
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
                        className={`font-sans text-sm cursor-pointer truncate transition-all duration-300 ${task.completed ? "task-completed" : "text-neo-black"
                            }`}
                        onClick={() => !task.completed && setIsEditing(true)}
                        title={task.completed ? task.title : "Klik untuk mengedit"}
                    >
                        {task.title}
                    </p>
                )}

                {/* Meta badges */}
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
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-heading font-bold neo-border ${isOverdue ? "bg-neo-red text-neo-white" : isDueToday ? "bg-neo-orange" : "bg-neo-white"
                            }`}>
                            <Calendar size={9} strokeWidth={3} />
                            {new Date(task.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
                {!task.completed && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-7 h-7 flex items-center justify-center neo-border bg-neo-cyan/30 hover:bg-neo-cyan transition-colors cursor-pointer"
                        aria-label="Edit tugas"
                    >
                        <Pencil size={12} strokeWidth={2.5} />
                    </button>
                )}
                <button
                    onClick={() => onDelete(task.id)}
                    className="w-7 h-7 flex items-center justify-center neo-border bg-neo-red/30 hover:bg-neo-red transition-colors cursor-pointer"
                    aria-label="Hapus tugas"
                >
                    <Trash2 size={12} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
