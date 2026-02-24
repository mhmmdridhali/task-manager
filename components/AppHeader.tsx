import Link from "next/link";
import NeoButton from "@/components/ui/NeoButton";

export default function AppHeader() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-neo-white neo-border mb-8">
            {/* Logo */}
            <Link href="/" className="font-heading text-2xl font-bold text-neo-black hover:opacity-80 transition-opacity">
                Taskly<span className="text-neo-pink">.</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <span className="font-sans text-sm text-neo-black/70 hidden sm:inline">
                    Halo, Pengguna! 👋
                </span>
                <NeoButton variant="white" className="text-sm px-4 py-2">
                    Keluar
                </NeoButton>
            </div>
        </header>
    );
}
