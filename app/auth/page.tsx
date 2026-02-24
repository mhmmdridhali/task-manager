"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import NeoButton from "@/components/ui/NeoButton";
import NeoInput from "@/components/ui/NeoInput";
import NeoCard from "@/components/ui/NeoCard";

type AuthMode = "login" | "register" | "reset";

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>("login");
    const [showPassword, setShowPassword] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const { addToast } = useToast();

    const formRef = useRef<HTMLDivElement>(null);

    const switchMode = (newMode: AuthMode) => {
        if (newMode === mode || isAnimating) return;
        setSlideDirection(newMode === "register" ? "left" : newMode === "reset" ? "right" : mode === "register" ? "right" : "left");
        setIsAnimating(true);
        setError("");
        setTimeout(() => {
            setMode(newMode);
            setTimeout(() => setIsAnimating(false), 50);
        }, 200);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Email dan kata sandi wajib diisi");
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            addToast(error.message, "error");
            setIsLoading(false);
        } else {
            addToast("Berhasil masuk", "success");
            router.push("/dashboard");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("Semua field wajib diisi");
            return;
        }
        if (password !== confirmPassword) {
            setError("Kata sandi tidak cocok");
            return;
        }
        if (password.length < 6) {
            setError("Kata sandi minimal 6 karakter");
            return;
        }

        // Email domain allowlist — prevent dummy/disposable emails
        const allowedDomains = [
            "gmail.com", "yahoo.com", "yahoo.co.id", "outlook.com", "hotmail.com",
            "icloud.com", "live.com", "protonmail.com", "proton.me",
            "mail.com", "zoho.com", "yandex.com", "aol.com",
        ];
        const emailDomain = email.split("@")[1]?.toLowerCase();
        if (!emailDomain || !allowedDomains.includes(emailDomain)) {
            setError(`Email harus menggunakan provider terpercaya (Gmail, Yahoo, Outlook, dll). Domain "${emailDomain}" tidak diizinkan.`);
            addToast("Gunakan email asli (Gmail, Yahoo, Outlook, dll.)", "error");
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) {
            if (error.message.includes("already registered") || error.message.includes("User already exists")) {
                addToast("Email sudah terdaftar. Silakan masuk.", "info");
                switchMode("login");
            } else {
                setError(error.message);
                addToast(error.message, "error");
            }
            setIsLoading(false);
        } else {
            addToast("Pendaftaran berhasil!", "success");
            router.push("/dashboard");
        }
    };

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    prompt: "select_account",
                },
            },
        });
        if (error) {
            setError(error.message);
            addToast(error.message, "error");
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Masukkan email akunmu");
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset`,
        });

        setIsLoading(false);
        if (error) {
            setError(error.message);
            addToast(error.message, "error");
        } else {
            addToast("Tautan reset sandi dikirim ke email", "success");
            switchMode("login");
        }
    };

    return (
        <div className="min-h-screen bg-neo-bg flex flex-col items-center justify-center px-6 py-12 relative">
            <div className="absolute top-16 left-8 w-14 h-14 bg-neo-yellow neo-border neo-shadow-sm animate-float opacity-50 hidden md:block" />
            <div className="absolute bottom-20 right-12 w-10 h-10 bg-neo-pink neo-border neo-shadow-sm animate-float opacity-50 hidden md:block" style={{ animationDelay: "1s" }} />

            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 font-heading font-bold text-sm text-neo-black/60 hover:text-neo-black transition-colors"
            >
                <ArrowLeft size={18} strokeWidth={3} />
                Kembali ke Beranda
            </Link>

            <Link href="/" className="mb-2">
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-neo-black">
                    Taskly<span className="text-neo-pink">.</span>
                </h1>
            </Link>
            <p className="font-sans text-sm text-neo-black/50 mb-8 transition-opacity duration-300">
                {mode === "login" ? "Masuk ke akunmu dan mulai produktif!" :
                    mode === "register" ? "Buat akun baru dan mulai perjalananmu!" :
                        "Reset kata sandimu untuk kembali mengakses akun."}
            </p>

            <NeoCard color="white" className="w-full max-w-md overflow-hidden">
                {/* Tab Toggle */}
                <div className="flex neo-border border-t-0 border-l-0 border-r-0">
                    <button
                        onClick={() => switchMode("login")}
                        className={`flex-1 py-3.5 font-heading font-bold text-sm transition-all duration-300 cursor-pointer relative ${mode === "login" ? "bg-neo-yellow text-neo-black" : "bg-neo-white text-neo-black/40 hover:bg-neo-gray"
                            }`}
                    >
                        Masuk
                        {mode === "login" && (
                            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-neo-black transition-all duration-300" />
                        )}
                    </button>
                    <button
                        onClick={() => switchMode("register")}
                        className={`flex-1 py-3.5 font-heading font-bold text-sm transition-all duration-300 cursor-pointer border-l-[3px] border-neo-black relative ${mode === "register" ? "bg-neo-yellow text-neo-black" : "bg-neo-white text-neo-black/40 hover:bg-neo-gray"
                            }`}
                    >
                        Daftar
                        {mode === "register" && (
                            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-neo-black transition-all duration-300" />
                        )}
                    </button>
                </div>

                {/* Animated Form Container */}
                <div className="relative overflow-hidden">
                    <div
                        ref={formRef}
                        className={`p-8 transition-all duration-300 ease-out ${isAnimating
                            ? slideDirection === "left"
                                ? "opacity-0 -translate-x-4"
                                : "opacity-0 translate-x-4"
                            : "opacity-100 translate-x-0"
                            }`}
                    >
                        {error && (
                            <div className="mb-4 p-3 neo-border bg-neo-red/20 font-sans text-sm text-neo-black animate-fade-in-up">
                                {error}
                            </div>
                        )}

                        <form onSubmit={mode === "login" ? handleLogin : mode === "register" ? handleRegister : handleResetPassword} className="space-y-4">
                            {mode === "register" && (
                                <div className="transition-all duration-300">
                                    <label className="font-heading font-bold text-sm text-neo-black mb-1 block">Nama Lengkap</label>
                                    <div className="relative">
                                        <User size={16} strokeWidth={3} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black/30" />
                                        <NeoInput placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="font-heading font-bold text-sm text-neo-black mb-1 block">Email</label>
                                <div className="relative">
                                    <Mail size={16} strokeWidth={3} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black/30" />
                                    <NeoInput type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                                </div>
                            </div>

                            {mode !== "reset" && (
                                <div>
                                    <label className="font-heading font-bold text-sm text-neo-black mb-1 block">Kata Sandi</label>
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
                            )}

                            {mode === "register" && (
                                <div className="transition-all duration-300">
                                    <label className="font-heading font-bold text-sm text-neo-black mb-1 block">Konfirmasi Kata Sandi</label>
                                    <div className="relative">
                                        <Lock size={16} strokeWidth={3} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black/30" />
                                        <NeoInput type={showPassword ? "text" : "password"} placeholder="Ulang kata sandi" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" />
                                    </div>
                                </div>
                            )}

                            {mode === "login" && (
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="neo-checkbox w-5 h-5" />
                                        <span className="font-sans text-sm text-neo-black/60">Ingat saya</span>
                                    </label>
                                    <button type="button" onClick={() => switchMode("reset")} className="font-sans text-sm text-neo-pink font-medium hover:underline cursor-pointer">Lupa sandi?</button>
                                </div>
                            )}

                            {mode === "reset" && (
                                <div className="text-center mb-4">
                                    <button type="button" onClick={() => switchMode("login")} className="font-sans text-sm text-neo-black/60 hover:text-neo-black underline cursor-pointer">
                                        Kembali ke Login
                                    </button>
                                </div>
                            )}

                            <NeoButton type="submit" variant="yellow" className="w-full text-base py-3" disabled={isLoading}>
                                {isLoading ? "Memproses..." : mode === "login" ? "Masuk" : mode === "register" ? "Daftar Sekarang" : "Kirim Link Reset"}
                            </NeoButton>
                        </form>

                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-[2px] bg-neo-black/10" />
                            <span className="font-sans text-xs text-neo-black/30">atau</span>
                            <div className="flex-1 h-[2px] bg-neo-black/10" />
                        </div>

                        <NeoButton variant="white" className="w-full text-sm py-2.5" onClick={handleGoogleAuth} disabled={isLoading}>
                            <span className="inline-block w-4 h-4 rounded-full bg-neo-cyan neo-border border-[2px] mr-2" />
                            {mode === "login" ? "Masuk" : "Daftar"} dengan Google
                        </NeoButton>
                    </div>
                </div>
            </NeoCard>
        </div>
    );
}
