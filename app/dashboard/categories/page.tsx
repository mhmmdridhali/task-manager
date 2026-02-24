"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, Pencil, Trash2, X, Check, Palette } from "lucide-react";
import { useTaskStore } from "@/lib/TaskContext";
import { useToast } from "@/components/ToastProvider";

const COLOR_OPTIONS = [
    { id: "bg-neo-cyan", label: "Cyan" },
    { id: "bg-neo-pink", label: "Pink" },
    { id: "bg-neo-yellow", label: "Kuning" },
    { id: "bg-neo-green", label: "Hijau" },
    { id: "bg-neo-orange", label: "Oranye" },
];

export default function CategoriesPage() {
    const { categories, fetchCategories, addCategory, editCategory, deleteCategory, restoreCategory } = useTaskStore();
    const { addToast } = useToast();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editColor, setEditColor] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState("bg-neo-cyan");

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAdd = async () => {
        const trimmed = newName.trim();
        if (!trimmed) return;

        await addCategory(trimmed, newColor);
        setNewName("");
        setNewColor("bg-neo-cyan");
        setIsAdding(false);
    };

    const startEdit = (cat: any) => {
        setEditingId(cat.id);
        setEditName(cat.name);
        setEditColor(cat.color);
    };

    const handleSaveEdit = async () => {
        const trimmed = editName.trim();
        if (!trimmed || !editingId) return;
        await editCategory(editingId, trimmed, editColor);
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        const deleted = await deleteCategory(id);
        if (deleted) {
            addToast(`Kategori "${deleted.name}" dihapus`, "info", () => {
                restoreCategory(deleted);
                addToast("Kategori dikembalikan!", "success");
            });
        }
    };

    return (
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-bold text-neo-black mb-1">Kategori</h1>
                    <p className="font-sans text-base text-neo-black/50">Kelola kategori untuk mengorganisir tugasmu</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2.5 neo-border bg-neo-cyan hover:bg-neo-cyan/80 font-heading font-bold text-sm transition-colors cursor-pointer neo-shadow-sm"
                >
                    {isAdding ? <X size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                    {isAdding ? "Batal" : "Tambah"}
                </button>
            </div>

            {/* Add form */}
            {isAdding && (
                <div className="mb-6 p-4 neo-border neo-shadow-sm bg-neo-white space-y-3">
                    <input
                        type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setIsAdding(false); }}
                        placeholder="Nama kategori baru..." className="w-full px-3 py-2 font-sans text-sm neo-border border-[2px] focus:outline-none focus:border-[var(--neo-cyan)]" autoFocus
                    />
                    <div>
                        <label className="font-heading font-bold text-xs text-neo-black/60 mb-1.5 flex items-center gap-1">
                            <Palette size={12} strokeWidth={2.5} /> Pilih warna
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {COLOR_OPTIONS.map((c) => (
                                <button key={c.id} onClick={() => setNewColor(c.id)}
                                    className={`px-3 py-1.5 text-xs font-heading font-bold neo-border cursor-pointer transition-all ${c.id} ${newColor === c.id ? "neo-shadow-sm ring-2 ring-neo-black/30" : "opacity-60 hover:opacity-100"}`}>
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleAdd} disabled={!newName.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 font-heading font-bold text-sm neo-border bg-neo-green hover:bg-neo-green/80 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                        <Plus size={14} strokeWidth={3} /> Simpan Kategori
                    </button>
                </div>
            )}

            {/* Categories list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                    <div key={cat.id} className={`p-4 neo-border neo-shadow-sm ${cat.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--neo-black)]`}>
                        {editingId === cat.id ? (
                            <div className="space-y-2">
                                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(); if (e.key === "Escape") setEditingId(null); }}
                                    className="w-full px-2 py-1 font-sans text-sm neo-border border-[2px] bg-neo-white focus:outline-none focus:border-[var(--neo-cyan)]" autoFocus />
                                <div className="flex gap-1 flex-wrap">
                                    {COLOR_OPTIONS.map((c) => (
                                        <button key={c.id} onClick={() => setEditColor(c.id)}
                                            className={`px-2 py-0.5 text-[10px] font-heading font-bold neo-border cursor-pointer ${c.id} ${editColor === c.id ? "neo-shadow-sm" : "opacity-50 hover:opacity-100"}`}>
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-1.5">
                                    <button onClick={handleSaveEdit} className="flex items-center gap-1 px-2.5 py-1 text-xs font-heading font-bold neo-border bg-neo-white hover:bg-neo-green/40 transition-colors cursor-pointer">
                                        <Check size={10} strokeWidth={3} /> Simpan
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-2.5 py-1 text-xs font-heading font-bold neo-border bg-neo-white hover:bg-neo-gray transition-colors cursor-pointer">
                                        <X size={10} strokeWidth={3} /> Batal
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Tag size={18} strokeWidth={2.5} className="text-neo-black/60" />
                                    <div>
                                        <h3 className="font-heading font-bold text-lg text-neo-black">{cat.name}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => startEdit(cat)} className="w-8 h-8 flex items-center justify-center neo-border bg-neo-white hover:bg-neo-gray transition-colors cursor-pointer" aria-label="Edit">
                                        <Pencil size={14} strokeWidth={2.5} />
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 flex items-center justify-center neo-border bg-neo-white hover:bg-neo-red/30 transition-colors cursor-pointer" aria-label="Hapus">
                                        <Trash2 size={14} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-16">
                    <Tag size={48} strokeWidth={1.5} className="text-neo-black/20 mx-auto mb-4" />
                    <p className="font-heading font-bold text-xl text-neo-black/40">Belum ada kategori</p>
                    <p className="font-sans text-sm text-neo-black/30 mt-1">Klik tombol Tambah untuk membuat kategori baru</p>
                </div>
            )}
        </main>
    );
}
