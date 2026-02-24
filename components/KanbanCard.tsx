"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Calendar, X, Check, ChevronDown } from "lucide-react";
import type { Task, Priority } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/types";
import { useTaskStore } from "@/lib/TaskContext";

interface KanbanCardProps {
    task: Task;
    onEdit: (id: string, updates: Partial<Pick<Task, "title" | "priority" | "categoryId" | "dueDate">>) => void;
    onDelete: (id: string) => void;
    isDragOverlay?: boolean;
}

export default function KanbanCard({ task, onEdit, onDelete, isDragOverlay }: KanbanCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editPriority, setEditPriority] = useState<Priority>(task.priority);
    const [editCategory, setEditCategory] = useState(task.categoryId || "");
    const [editDueDate, setEditDueDate] = useState(task.dueDate || "");
    const { categories } = useTaskStore();

    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging,
    } = useSortable({ id: task.id, disabled: isDragOverlay });

    const style = { transform: CSS.Transform.toString(transform), transition };

    const handleSave = () => {
        const updates: Partial<Pick<Task, "title" | "priority" | "categoryId" | "dueDate">> = {};
        const trimmed = editTitle.trim();
        if (trimmed && trimmed !== task.title) updates.title = trimmed;
        if (editPriority !== task.priority) updates.priority = editPriority;
        if (editCategory !== (task.categoryId || "")) updates.categoryId = editCategory || undefined;
        if (editDueDate !== (task.dueDate || "")) updates.dueDate = editDueDate || undefined;
        if (Object.keys(updates).length > 0) onEdit(task.id, updates);
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setEditTitle(task.title);
        setEditPriority(task.priority);
        setEditCategory(task.categoryId || "");
        setEditDueDate(task.dueDate || "");
        setIsEditing(false);
    };

    const priority = PRIORITY_CONFIG[task.priority];
    const category = categories.find((c) => c.id === task.categoryId);
    const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

    if (isDragOverlay) {
        return (
            <div className="p-2.5 neo-border neo-shadow bg-neo-white rotate-2 scale-105 opacity-90 w-56">
                <p className="font-sans text-sm font-medium text-neo-black truncate">{task.title}</p>
                <span className={`inline-block mt-1 px-1.5 py-0.5 text-[9px] font-heading font-bold neo-border ${priority.color}`}>{priority.label}</span>
            </div>
        );
    }

    // --- Edit mode (full form) ---
    if (isEditing) {
        return (
            <div ref={setNodeRef} style={style} className="p-2.5 neo-border neo-shadow-sm bg-neo-white space-y-2">
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") cancelEdit(); }}
                    className="w-full px-2 py-1 font-sans text-sm neo-border border-[2px] focus:outline-none focus:border-[var(--neo-cyan)]" autoFocus />
                {/* Priority */}
                <div className="flex gap-1">
                    {(Object.entries(PRIORITY_CONFIG) as [Priority, { label: string; color: string }][]).map(([k, c]) => (
                        <button key={k} onClick={() => setEditPriority(k)}
                            className={`px-2 py-0.5 text-[10px] font-heading font-bold neo-border border-[1.5px] cursor-pointer transition-all ${editPriority === k ? `${c.color} neo-shadow-sm` : "bg-neo-white opacity-50 hover:opacity-100"}`}>
                            {c.label}
                        </button>
                    ))}
                </div>
                {/* Category */}
                <div className="relative">
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-2 py-1 text-[11px] font-sans neo-border border-[1.5px] bg-neo-bg appearance-none cursor-pointer focus:outline-none">
                        <option value="">Tanpa kategori</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neo-black/40" />
                </div>
                {/* Due date */}
                <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full px-2 py-1 text-[11px] font-sans neo-border border-[1.5px] bg-neo-bg cursor-pointer focus:outline-none" />
                {/* Actions */}
                <div className="flex gap-1.5">
                    <button onClick={handleSave} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-heading font-bold neo-border bg-neo-green/40 hover:bg-neo-green transition-colors cursor-pointer">
                        <Check size={10} strokeWidth={3} /> Simpan
                    </button>
                    <button onClick={cancelEdit} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-heading font-bold neo-border bg-neo-white hover:bg-neo-gray transition-colors cursor-pointer">
                        <X size={10} strokeWidth={3} /> Batal
                    </button>
                </div>
            </div>
        );
    }

    // --- Normal mode: 3-grid layout [drag+content | edit | delete] ---
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        flex items-stretch neo-border bg-neo-white transition-all duration-150
        ${isDragging ? "opacity-30 scale-95" : "neo-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--neo-black)]"}
        ${task.completed ? "opacity-60" : ""}
      `}
        >
            {/* Grid 1: Drag + Content */}
            <div className="flex-1 flex items-start gap-1 p-2 min-w-0">
                <button {...attributes} {...listeners}
                    className="w-5 h-full flex items-center justify-center text-neo-black/20 hover:text-neo-black cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
                    aria-label="Drag">
                    <GripVertical size={12} strokeWidth={2.5} />
                </button>
                <div className="flex-1 min-w-0">
                    <p className={`font-sans text-xs leading-snug ${task.completed ? "line-through text-neo-black/40" : "text-neo-black"}`}>
                        {task.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <span className={`px-1 py-0.5 text-[8px] font-heading font-bold neo-border border-[1.5px] ${priority.color}`}>{priority.label}</span>
                        {category && <span className={`px-1 py-0.5 text-[8px] font-heading font-bold neo-border border-[1.5px] ${category.color}`}>{category.name}</span>}
                        {task.dueDate && (
                            <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 text-[8px] font-heading font-bold neo-border border-[1.5px] ${isOverdue ? "bg-neo-red text-neo-white" : "bg-neo-white"}`}>
                                <Calendar size={7} strokeWidth={3} />
                                {new Date(task.dueDate + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid 2: Edit button */}
            {!task.completed && (
                <button onClick={() => setIsEditing(true)}
                    className="w-9 flex items-center justify-center border-l-[2px] border-neo-black bg-neo-cyan/15 hover:bg-neo-cyan/40 transition-colors cursor-pointer flex-shrink-0"
                    aria-label="Edit" title="Edit">
                    <Pencil size={12} strokeWidth={2.5} />
                </button>
            )}

            {/* Grid 3: Delete button */}
            <button onClick={() => onDelete(task.id)}
                className={`w-9 flex items-center justify-center border-l-[2px] border-neo-black bg-neo-red/15 hover:bg-neo-red/40 transition-colors cursor-pointer flex-shrink-0 ${task.completed ? '' : ''}`}
                aria-label="Hapus" title="Hapus">
                <Trash2 size={12} strokeWidth={2.5} />
            </button>
        </div>
    );
}
