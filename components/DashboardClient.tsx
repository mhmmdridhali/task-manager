"use client";

import { useMemo, useState, useEffect } from "react";
import { CalendarDays, CheckCircle2, Flame, Clock, ArrowRight, Plus, X, ChevronDown, Calendar, Loader2, Pencil, Trash2, Check } from "lucide-react";
import Link from "next/link";
import type { Task, Priority } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/types";
import { useTaskStore } from "@/lib/TaskContext";
import { useToast } from "@/components/ToastProvider";
import CalendarWidget from "@/components/CalendarWidget";
import NeoCard from "@/components/ui/NeoCard";
import NeoButton from "@/components/ui/NeoButton";
import { createClient } from "@/lib/supabase/client";

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 5) return "Selamat malam";
    if (h < 12) return "Selamat pagi";
    if (h < 15) return "Selamat siang";
    if (h < 18) return "Selamat sore";
    return "Selamat malam";
}

function getMotivation(n: number): string {
    if (n === 0) return "Semua tugas selesai! Kamu luar biasa!";
    if (n <= 2) return "Sedikit lagi, semangat!";
    if (n <= 5) return "Ayo selesaikan satu per satu.";
    return "Banyak tugas menunggu. Mulai dari yang paling penting!";
}

// --- Add Task Modal ---
function AddTaskModal({ isOpen, onClose, onAdd }: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (title: string, priority: Priority, categoryId?: string, dueDate?: string) => void;
}) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [categoryId, setCategoryId] = useState("");
    const [dueDate, setDueDate] = useState(() => new Date().toISOString().split("T")[0]);
    const { categories } = useTaskStore();

    if (!isOpen) return null;

    const handleSubmit = () => {
        const t = title.trim();
        if (!t || !dueDate) return;
        onAdd(t, priority, categoryId || undefined, dueDate);
        setTitle(""); setPriority("medium"); setCategoryId("");
        setDueDate(new Date().toISOString().split("T")[0]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-neo-black/30" />
            <div className="relative neo-border neo-shadow bg-neo-white w-full max-w-md p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold text-neo-black">Tambah Tugas Baru</h2>
                    <button onClick={onClose} className="w-7 h-7 flex items-center justify-center neo-border bg-neo-gray hover:bg-neo-red/20 transition-colors cursor-pointer">
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
                    placeholder="Judul tugas..." className="w-full px-3 py-2 font-sans text-sm neo-border border-[2px] focus:outline-none focus:border-[var(--neo-cyan)]" autoFocus />
                {/* Priority */}
                <div>
                    <label className="font-heading text-xs font-bold text-neo-black/60 mb-1 block">Prioritas</label>
                    <div className="flex gap-1.5">
                        {(Object.entries(PRIORITY_CONFIG) as [Priority, { label: string; color: string }][]).map(([k, c]) => (
                            <button key={k} onClick={() => setPriority(k)}
                                className={`flex-1 py-1.5 text-xs font-heading font-bold neo-border cursor-pointer transition-all ${priority === k ? `${c.color} neo-shadow-sm` : "bg-neo-white opacity-60 hover:opacity-100"}`}>
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Category */}
                <div>
                    <label className="font-heading text-xs font-bold text-neo-black/60 mb-1 block">Kategori</label>
                    <div className="relative">
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-3 py-2 font-sans text-sm neo-border bg-neo-bg appearance-none cursor-pointer focus:outline-none">
                            <option value="">Tanpa kategori</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neo-black/40" />
                    </div>
                </div>
                <div>
                    <label className="font-heading text-xs font-bold text-neo-black/60 mb-1 block">Deadline</label>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} strokeWidth={2.5} className="text-neo-black/40 flex-shrink-0" />
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                            className="flex-1 px-3 py-2 font-sans text-sm neo-border bg-neo-bg cursor-pointer focus:outline-none" />
                    </div>
                </div>
                <button onClick={handleSubmit} disabled={!title.trim() || !dueDate}
                    className="w-full py-2.5 font-heading font-bold text-sm neo-border bg-neo-cyan hover:bg-neo-cyan/80 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <Plus size={16} strokeWidth={3} /> Tambah Tugas
                </button>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { tasks, toggleTask, addTask, editTask, deleteTask, restoreTask, activeCount, completedCount, fetchTasks, categories } = useTaskStore();
    const { addToast } = useToast();
    const [calendarDate, setCalendarDate] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [editCategory, setEditCategory] = useState("");

    // Auth State
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Pengguna");
            }
            setIsLoadingAuth(false);
        };
        fetchUser();
        fetchTasks();
    }, [supabase, fetchTasks]);

    const todayStr = new Date().toISOString().split("T")[0];

    // Today's tasks: active tasks due today/overdue/no-due, or filtered by calendar date
    const todayTasks = useMemo(() => {
        const active = tasks.filter((t) => !t.completed);
        if (calendarDate) return active.filter((t) => t.dueDate === calendarDate);
        return active.filter((t) => !t.dueDate || t.dueDate <= todayStr);
    }, [tasks, todayStr, calendarDate]);

    const overdueTasks = useMemo(() =>
        tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr), [tasks, todayStr]);

    // Progress: today's tasks only
    const todayAll = useMemo(() => {
        return tasks.filter((t) => !t.dueDate || t.dueDate <= todayStr);
    }, [tasks, todayStr]);
    const todayDone = todayAll.filter((t) => t.completed).length;
    const todayTotal = todayAll.length;
    const todayPct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;

    const handleAddTask = (title: string, priority: Priority, categoryId?: string, dueDate?: string) => {
        addTask(title, priority, categoryId, dueDate);
        addToast("Tugas baru ditambahkan!", "success");
    };

    const handleToggleTask = (task: Task) => {
        toggleTask(task.id);
        if (!task.completed) {
            addToast(`Tugas "${task.title}" terselesaikan!`, "success", () => {
                toggleTask(task.id);
                addToast("Tugas dikembalikan", "info");
            });
        }
    };

    const handleSaveEdit = (id: string) => {
        const title = editValue.trim();
        if (title) {
            editTask(id, { title, categoryId: editCategory || undefined });
            addToast("Tugas diperbarui!", "success");
        }
        setEditingTaskId(null);
    };

    const handleDeleteTask = async (id: string) => {
        const deleted = await deleteTask(id);
        if (deleted) {
            addToast(`"${deleted.title}" dihapus`, "info", () => {
                restoreTask(deleted);
                addToast("Tugas dikembalikan!", "success");
            });
        }
    };

    return (
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <p className="font-sans text-sm text-neo-black/40" suppressHydrationWarning>
                        {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <h1 className="font-heading text-3xl sm:text-4xl font-bold text-neo-black mb-1 flex items-center gap-2">
                        {getGreeting()},{" "}
                        {isLoadingAuth ? (
                            <Loader2 size={24} className="animate-spin text-neo-pink" />
                        ) : (
                            <span className="text-neo-pink truncate max-w-[200px] inline-block align-bottom">{userName}</span>
                        )}
                    </h1>
                    <p className="font-sans text-base text-neo-black/50">{getMotivation(activeCount)}</p>
                </div>
                <div className="flex gap-3">
                    {/* Add Task button */}
                    <button onClick={() => setShowAddModal(true)}
                        className="px-4 py-3 neo-border bg-neo-cyan neo-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--neo-black)] transition-all cursor-pointer flex items-center gap-2">
                        <Plus size={18} strokeWidth={3} />
                        <span className="font-heading font-bold text-sm">Tambah</span>
                    </button>
                    <div className="px-4 py-3 neo-border bg-neo-yellow neo-shadow-sm text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--neo-black)] cursor-default">
                        <p className="font-heading text-2xl font-bold text-neo-black">{activeCount}</p>
                        <p className="font-sans text-[10px] font-bold text-neo-black/60 uppercase tracking-wider">Aktif</p>
                    </div>
                    <div className="px-4 py-3 neo-border bg-neo-green neo-shadow-sm text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--neo-black)] cursor-default">
                        <p className="font-heading text-2xl font-bold text-neo-black">{completedCount}</p>
                        <p className="font-sans text-[10px] font-bold text-neo-black/60 uppercase tracking-wider">Selesai</p>
                    </div>
                    {overdueTasks.length > 0 && (
                        <div className="px-4 py-3 neo-border bg-neo-red/30 neo-shadow-sm text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--neo-black)] cursor-default">
                            <p className="font-heading text-2xl font-bold text-neo-black">{overdueTasks.length}</p>
                            <p className="font-sans text-[10px] font-bold text-neo-black/60 uppercase tracking-wider">Terlambat</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading text-xl font-bold text-neo-black flex items-center gap-2">
                            <Flame size={20} strokeWidth={2.5} />
                            {calendarDate ? "Tugas di Tanggal Ini" : "Tugas Hari Ini"}
                        </h2>
                        <Link href="/dashboard/board">
                            <NeoButton variant="white" className="text-xs px-3 py-1.5">
                                Lihat Semua <ArrowRight size={12} strokeWidth={3} className="inline ml-1" />
                            </NeoButton>
                        </Link>
                    </div>

                    {overdueTasks.length > 0 && !calendarDate && (
                        <div className="mb-4 p-3 neo-border bg-neo-red/20 flex items-center gap-2">
                            <Clock size={14} strokeWidth={2.5} className="text-neo-red flex-shrink-0" />
                            <p className="font-sans text-sm text-neo-black"><strong>{overdueTasks.length} tugas</strong> sudah lewat deadline!</p>
                        </div>
                    )}

                    {calendarDate && (
                        <div className="mb-4 p-3 neo-border bg-neo-cyan/20 flex items-center justify-between">
                            <p className="font-sans text-sm text-neo-black">
                                <CalendarDays size={14} strokeWidth={2.5} className="inline mr-1" />
                                Filter: {new Date(calendarDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
                            </p>
                            <button onClick={() => setCalendarDate(null)} className="font-heading font-bold text-xs text-neo-cyan hover:underline cursor-pointer">Hapus</button>
                        </div>
                    )}

                    {todayTasks.length === 0 ? (
                        <NeoCard color="bg" className="p-8 text-center">
                            <CheckCircle2 size={40} strokeWidth={1.5} className="mx-auto mb-3 text-neo-green" />
                            <h3 className="font-heading text-lg font-bold text-neo-black mb-1">
                                {calendarDate ? "Tidak ada tugas di tanggal ini" : "Semua tugas hari ini selesai!"}
                            </h3>
                            <p className="font-sans text-sm text-neo-black/50">
                                {calendarDate ? "Pilih tanggal lain di kalender" : "Waktunya istirahat atau cek tugas mendatang"}
                            </p>
                        </NeoCard>
                    ) : (
                        <div className="space-y-2">
                            {todayTasks.slice(0, 8).map((task) => {
                                const pr = PRIORITY_CONFIG[task.priority];
                                const cat = categories.find((c) => c.id === task.categoryId);
                                const isOd = task.dueDate && task.dueDate < todayStr;
                                const isEditing = editingTaskId === task.id;

                                return (
                                    <div key={task.id} className="group flex items-center gap-3 p-3 neo-border neo-shadow-sm bg-neo-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--neo-black)] transition-all">
                                        <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task)} className="neo-checkbox flex-shrink-0" />
                                        <div className={`w-1 self-stretch flex-shrink-0 ${pr.color}`} />

                                        {isEditing ? (
                                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                                <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(task.id); if (e.key === "Escape") setEditingTaskId(null); }}
                                                    className="flex-1 px-2 py-1 font-sans text-sm neo-border border-[2px] bg-neo-white focus:outline-none focus:border-[var(--neo-cyan)]" autoFocus />
                                                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}
                                                    className="w-24 px-2 py-1 font-sans text-xs neo-border bg-neo-white appearance-none cursor-pointer focus:outline-none">
                                                    <option value="">No Cat</option>
                                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                                <button onClick={() => handleSaveEdit(task.id)} className="w-7 h-7 flex items-center justify-center neo-border bg-neo-green hover:bg-neo-green/80 transition-colors cursor-pointer">
                                                    <Check size={14} strokeWidth={3} />
                                                </button>
                                                <button onClick={() => setEditingTaskId(null)} className="w-7 h-7 flex items-center justify-center neo-border bg-neo-gray transition-colors cursor-pointer">
                                                    <X size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-sans text-sm truncate ${task.completed ? "line-through text-neo-black/40" : "text-neo-black"}`}>{task.title}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                        <span className={`px-1.5 py-0.5 text-[10px] font-heading font-bold neo-border ${pr.color}`}>{pr.label}</span>
                                                        {cat && <span className={`px-1.5 py-0.5 text-[10px] font-heading font-bold neo-border ${cat.color}`}>{cat.name}</span>}
                                                        {task.dueDate && (
                                                            <span className={`px-1.5 py-0.5 text-[10px] font-heading font-bold neo-border ${isOd ? "bg-neo-red text-neo-white" : "bg-neo-white"}`}>
                                                                {new Date(task.dueDate + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                                            </span>
                                                        )}
                                                        {isOd && <span className="px-1.5 py-0.5 text-[10px] font-heading font-bold neo-border bg-neo-red text-neo-white">Terlambat</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditingTaskId(task.id); setEditValue(task.title); setEditCategory(task.categoryId || ""); }}
                                                        className="w-7 h-7 flex items-center justify-center neo-border bg-neo-white mx-1 hover:bg-neo-gray transition-colors cursor-pointer">
                                                        <Pencil size={12} strokeWidth={2.5} />
                                                    </button>
                                                    <button onClick={() => handleDeleteTask(task.id)}
                                                        className="w-7 h-7 flex items-center justify-center neo-border bg-neo-white hover:bg-neo-red/30 transition-colors cursor-pointer">
                                                        <Trash2 size={12} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                            {todayTasks.length > 8 && (
                                <Link href="/dashboard/board" className="block text-center pt-2">
                                    <NeoButton variant="white" className="text-xs px-4 py-1.5 w-full">+{todayTasks.length - 8} tugas lainnya</NeoButton>
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar: Calendar + Progress */}
                <div className="lg:w-72 flex-shrink-0">
                    <CalendarWidget tasks={tasks} selectedDate={calendarDate} onSelectDate={setCalendarDate} />
                    <NeoCard color="white" className="p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--neo-black)] cursor-default">
                        <h3 className="font-heading text-sm font-bold text-neo-black mb-3">Progress Hari Ini</h3>
                        <div className="neo-border bg-neo-gray overflow-hidden h-6 mb-2">
                            <div className="h-full bg-neo-green flex items-center justify-center transition-all duration-500"
                                style={{ width: `${todayTotal > 0 ? Math.max(todayPct, 8) : 8}%` }}>
                                <span className="font-heading text-[10px] font-bold text-neo-black px-2">{todayDone}/{todayTotal}</span>
                            </div>
                        </div>
                        <p className="font-sans text-[11px] text-neo-black/40">{todayTotal > 0 ? `${todayPct}% tercapai` : "Belum ada tugas"}</p>
                    </NeoCard>
                </div>
            </div>

            <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddTask} />
        </main>
    );
}
