"use client";

import { useEffect } from "react";
import NeoButton from "@/components/ui/NeoButton";
import NeoCard from "@/components/ui/NeoCard";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-6">
            <NeoCard color="white" className="max-w-md w-full text-center p-10">
                <p className="text-6xl mb-4">😵</p>
                <h2 className="font-heading text-2xl font-bold text-neo-black mb-3">
                    Aduh, ada yang error!
                </h2>
                <p className="font-sans text-base text-neo-black/50 mb-6">
                    Sepertinya terjadi kesalahan saat memuat halaman ini. Jangan khawatir,
                    coba lagi yuk!
                </p>
                <div className="flex gap-3 justify-center">
                    <NeoButton variant="yellow" onClick={reset}>
                        🔄 Coba Lagi
                    </NeoButton>
                    <NeoButton
                        variant="white"
                        onClick={() => (window.location.href = "/dashboard")}
                    >
                        🏠 Ke Dashboard
                    </NeoButton>
                </div>
            </NeoCard>
        </div>
    );
}
