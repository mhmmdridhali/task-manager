import Link from "next/link";
import NeoButton from "@/components/ui/NeoButton";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-neo-bg flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Decorative floating blocks */}
            <div className="absolute top-20 left-[15%] w-12 h-12 bg-neo-yellow neo-border neo-shadow animate-float opacity-50" />
            <div className="absolute bottom-32 right-[20%] w-16 h-16 bg-neo-pink neo-border neo-shadow animate-float-alt opacity-40" />
            <div className="absolute top-[40%] right-[10%] w-8 h-8 bg-neo-cyan neo-border animate-float opacity-30" />

            {/* 404 Display */}
            <div className="relative z-10">
                <h1 className="font-heading text-[10rem] sm:text-[14rem] font-bold text-neo-black leading-none animate-fade-in-up">
                    4
                    <span className="inline-block text-neo-pink animate-bounce-in" style={{ animationDelay: "0.2s" }}>
                        0
                    </span>
                    4
                </h1>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <p className="font-heading text-2xl sm:text-3xl font-bold text-neo-black mb-3">
                        Oops! Halaman ini kabur 🏃‍♂️💨
                    </p>
                    <p className="font-sans text-base text-neo-black/50 max-w-md mx-auto mb-8">
                        Sepertinya halaman yang kamu cari tidak ada, sudah dipindahkan, atau
                        mungkin sedang liburan. Yuk kembali ke tempat yang aman!
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                    <Link href="/">
                        <NeoButton variant="yellow" className="text-base px-8 py-3">
                            ← Kembali ke Beranda
                        </NeoButton>
                    </Link>
                    <Link href="/dashboard">
                        <NeoButton variant="cyan" className="text-base px-8 py-3">
                            📋 Ke Dashboard
                        </NeoButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}
