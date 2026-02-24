"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import NeoButton from "@/components/ui/NeoButton";
import NeoInput from "@/components/ui/NeoInput";
import NeoCard from "@/components/ui/NeoCard";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const supabase = createClient();
    const { addToast } = useToast();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            addToast("Kata sandi wajib diisi", "info");
            return;
        }

        if (password !== confirmPassword) {
            addToast("Kata sandi tidak cocok", "info");
            return;
        }

        if (password.length < 6) {
            addToast("Kata sandi minimal 6 karakter", "info");
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        setIsLoading(false);

        if (error) {
            addToast(error.message, "error");
        } else {
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-neo-bg flex flex-col items-center justify-center px-6 py-12">
            <div className="mb-8 text-center">
                <h1 className="font-heading text-4xl font-bold text-neo-black mb-2">
                    Reset Sandi
                </h1>
                <p className="font-sans text-sm text-neo-black/60">
                    Masukkan kata sandi barumu di bawah ini.
                </p>
            </div>

            <NeoCard color="white" className="w-full max-w-md p-8">
                {isSuccess ? (
                    <div className="text-center py-8 animate-fade-in-up">
                        <CheckCircle2 size={48} className="mx-auto text-neo-green mb-4" />
                        <h2 className="font-heading font-bold text-xl text-neo-black mb-2">Berhasil!</h2>
                        <p className="font-sans text-sm text-neo-black/60">Kata sandi berhasil diperbarui. Mengalihkan ke Dashboard...</p>
                    </div>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="font-heading font-bold text-sm text-neo-black mb-1 block">Kata Sandi Baru</label>
                            <div className="relative">
                                <Lock size={16} strokeWidth={3} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black/30" />
                                <NeoInput
                                    type={showPassword ? "text" : "password"} placeholder="Min. 6 karakter"
                                    value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-black/30 hover:text-neo-black cursor-pointer">
                                    {showPassword ? <EyeOff size={16} strokeWidth={3} /> : <Eye size={16} strokeWidth={3} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="font-heading font-bold text-sm text-neo-black mb-1 block">Konfirmasi Kata Sandi Baru</label>
                            <div className="relative">
                                <Lock size={16} strokeWidth={3} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black/30" />
                                <NeoInput type={showPassword ? "text" : "password"} placeholder="Ulangi kata sandi" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" />
                            </div>
                        </div>

                        <NeoButton type="submit" variant="yellow" className="w-full text-base py-3 mt-4" disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : "Simpan Sandi Baru"}
                        </NeoButton>
                    </form>
                )}
            </NeoCard>
        </div>
    );
}
