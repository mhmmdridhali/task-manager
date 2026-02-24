"use client";

import { useState } from "react";
import { Plus, ChevronDown, Calendar } from "lucide-react";
import type { Priority } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/types";
import { useTaskStore } from "@/lib/TaskContext";
import NeoButton from "@/components/ui/NeoButton";
import NeoInput from "@/components/ui/NeoInput";

interface TaskInputFieldProps {
    onAddTask: (title: string, priority: Priority, categoryId?: string, dueDate?: string) => void;
}

export default function TaskInputField({ onAddTask }: TaskInputFieldProps) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [categoryId, setCategoryId] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const { categories } = useTaskStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;
        onAddTask(trimmed, priority, categoryId || undefined, dueDate || undefined);
        setTitle("");
        setPriority("medium");
        setCategoryId("");
        setDueDate("");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2 mb-2">
                <div className="flex-1">
                    <NeoInput
                        placeholder="Apa yang mau kamu kerjakan hari ini?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <NeoButton type="submit" variant="green" className="text-sm px-5 py-2" disabled={!title.trim()}>
                    <Plus size={16} strokeWidth={3} className="inline mr-1" />
                    Tambah
                </NeoButton>
            </div>

            {/* Expand options */}
            <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-1 font-sans text-xs text-neo-black/40 hover:text-neo-black transition-colors cursor-pointer mb-2"
            >
                <ChevronDown size={12} strokeWidth={3} className={`transition-transform ${showOptions ? "rotate-180" : ""}`} />
                {showOptions ? "Sembunyikan opsi" : "Opsi lanjutan"}
            </button>

            {showOptions && (
                <div className="flex flex-wrap gap-3 p-3 neo-border bg-neo-white">
                    {/* Priority */}
                    <div className="flex items-center gap-1">
                        <span className="font-heading text-xs font-bold text-neo-black/50 mr-1">Prioritas:</span>
                        {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => {
                            const config = PRIORITY_CONFIG[p];
                            return (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`px-2 py-1 text-xs font-heading font-bold neo-border transition-all cursor-pointer ${priority === p ? `${config.color} neo-shadow-sm` : "bg-neo-white shadow-none"
                                        }`}
                                >
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-1">
                        <span className="font-heading text-xs font-bold text-neo-black/50 mr-1">Kategori:</span>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="px-2 py-1 text-xs font-heading font-bold neo-border bg-neo-white cursor-pointer"
                        >
                            <option value="">Tanpa</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Due date */}
                    <div className="flex items-center gap-1">
                        <Calendar size={12} strokeWidth={3} className="text-neo-black/50" />
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="px-2 py-1 text-xs font-heading font-bold neo-border bg-neo-white cursor-pointer"
                        />
                    </div>
                </div>
            )}
        </form>
    );
}
