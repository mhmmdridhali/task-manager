"use client";

import { useState, useEffect } from "react";
import { Keyboard, Info, User, Save, Loader2, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import NeoButton from "@/components/ui/NeoButton";
import NeoCard from "@/components/ui/NeoCard";
import NeoInput from "@/components/ui/NeoInput";

export default function SettingsPage() {
    const [userName, setUserName] = useState("Pengguna");
    const [userEmail, setUserEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    // Password change state
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const supabase = createClient();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Pengguna");
                setUserEmail(user.email || "");
                setIsGoogleUser(user.app_metadata?.provider === 'google');
            }
            setIsLoading(false);
        };
        fetchUser();
    }, [supabase]);

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: userName }
        });

        // Optionally update the profiles table if RLS permits
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('profiles').update({ name: userName }).eq('id', user.id);
        }

        setIsSaving(false);
        if (error) {
            addToast(error.message, "error");
        } else {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            addToast("Profil berhasil diperbarui", "success");
        }
    };

    const shortcuts = [
        { key: "N", desc: "Tugas baru" },
        { key: "/", desc: "Fokus ke pencarian" },
        { key: "Enter", desc: "Simpan/Submit" },
        { key: "Esc", desc: "Batal edit" },
    ];

    return (
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-neo-black mb-1">Pengaturan</h1>
                <p className="font-sans text-base text-neo-black/50">Sesuaikan Taskly sesuai seleramu</p>
            </div>

            {/* User Profile */}
            <section className="mb-8">
                <h2 className="font-heading text-xl font-bold text-neo-black mb-4 flex items-center gap-2">
                    <User size={20} strokeWidth={2.5} /> Profil Pengguna
                </h2>
                <NeoCard color="white" className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center p-4"><Loader2 size={24} className="animate-spin text-neo-pink" /></div>
                    ) : (
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 bg-neo-cyan neo-border flex items-center justify-center font-heading font-bold text-2xl text-neo-black flex-shrink-0">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="font-heading font-bold text-sm text-neo-black mb-1 block">Nama</label>
                                    <NeoInput value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Nama kamu" />
                                </div>
                                <div>
                                    <label className="font-heading font-bold text-sm text-neo-black mb-1 block">Email</label>
                                    <NeoInput type="email" value={userEmail} disabled className="opacity-60 cursor-not-allowed" />
                                </div>
                                <NeoButton variant={saved ? "green" : "yellow"} className="text-sm px-4 py-2" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Loader2 size={14} className="inline mr-1 animate-spin" /> : <Save size={14} strokeWidth={2.5} className="inline mr-1" />}
                                    {isSaving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan"}
                                </NeoButton>
                            </div>
                        </div>
                    )}
                </NeoCard>
            </section>

            {/* Password Change */}
            <section className="mb-8">
                <h2 className="font-heading text-xl font-bold text-neo-black mb-4 flex items-center gap-2">
                    <KeyRound size={20} strokeWidth={2.5} /> Ubah Kata Sandi
                </h2>
                <NeoCard color="white" className="p-6">
                    {isGoogleUser ? (
                        <p className="font-sans text-sm text-neo-black/50">Kamu login menggunakan Google. Untuk mengganti password, kelola langsung dari akun Google-mu.</p>
                    ) : (
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="font-heading font-bold text-sm text-neo-black mb-1 block">Kata Sandi Baru</label>
                                <div className="relative">
                                    <Lock size={16} strokeWidth={3} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black/30" />
                                    <NeoInput type={showPassword ? "text" : "password"} placeholder="Min. 6 karakter" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10 pr-10" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-black/30 hover:text-neo-black cursor-pointer">
                                        {showPassword ? <EyeOff size={16} strokeWidth={3} /> : <Eye size={16} strokeWidth={3} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="font-heading font-bold text-sm text-neo-black mb-1 block">Konfirmasi Sandi Baru</label>
                                <div className="relative">
                                    <Lock size={16} strokeWidth={3} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black/30" />
                                    <NeoInput type={showPassword ? "text" : "password"} placeholder="Ulang kata sandi" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="pl-10" />
                                </div>
                            </div>
                            <NeoButton variant="pink" className="text-sm px-4 py-2" disabled={isSavingPassword} onClick={async () => {
                                if (!newPassword || !confirmNewPassword) { addToast("Kedua field wajib diisi", "info"); return; }
                                if (newPassword.length < 6) { addToast("Kata sandi minimal 6 karakter", "info"); return; }
                                if (newPassword !== confirmNewPassword) { addToast("Kata sandi tidak cocok", "info"); return; }
                                setIsSavingPassword(true);
                                const { error } = await supabase.auth.updateUser({ password: newPassword });
                                setIsSavingPassword(false);
                                if (error) { addToast(error.message, "error"); } else {
                                    addToast("Kata sandi berhasil diperbarui!", "success");
                                    setNewPassword(""); setConfirmNewPassword("");
                                }
                            }}>
                                {isSavingPassword ? <Loader2 size={14} className="inline mr-1 animate-spin" /> : <KeyRound size={14} strokeWidth={2.5} className="inline mr-1" />}
                                {isSavingPassword ? "Memperbarui..." : "Ubah Sandi"}
                            </NeoButton>
                        </div>
                    )}
                </NeoCard>
            </section>

            {/* Keyboard shortcuts */}
            <section className="mb-8">
                <h2 className="font-heading text-xl font-bold text-neo-black mb-4 flex items-center gap-2">
                    <Keyboard size={20} strokeWidth={2.5} /> Pintasan Keyboard
                </h2>
                <NeoCard color="white" className="p-6">
                    <div className="space-y-3">
                        {shortcuts.map((s) => (
                            <div key={s.key} className="flex items-center justify-between">
                                <span className="font-sans text-sm text-neo-black/70">{s.desc}</span>
                                <kbd className="px-3 py-1 font-heading font-bold text-xs neo-border bg-neo-gray">{s.key}</kbd>
                            </div>
                        ))}
                    </div>
                </NeoCard>
            </section>

            {/* About */}
            <section>
                <h2 className="font-heading text-xl font-bold text-neo-black mb-4 flex items-center gap-2">
                    <Info size={20} strokeWidth={2.5} /> Tentang
                </h2>
                <NeoCard color="bg" className="p-6">
                    <p className="font-heading font-bold text-lg text-neo-black mb-1">
                        Taskly<span className="text-neo-pink">.</span> v1.0
                    </p>
                    <p className="font-sans text-sm text-neo-black/50">
                        Aplikasi manajemen tugas personal dengan desain Neobrutalism.
                        Dibangun dengan Next.js, Tailwind CSS, dan penuh semangat.
                    </p>
                    <p className="font-sans text-xs text-neo-black/30 mt-2">
                        Dibuat oleh Muhammad Ali Ridho
                    </p>
                </NeoCard>
            </section>
        </main>
    );
}
