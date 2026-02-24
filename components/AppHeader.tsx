import Link from "next/link";
import Image from "next/image";
import NeoButton from "@/components/ui/NeoButton";

export default function AppHeader() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-neo-white neo-border mb-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Image src="/logo.svg" alt="Taskly Logo" width={32} height={32} className="drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
                <h1 className="font-heading text-2xl font-bold text-neo-black">
                    Taskly<span className="text-neo-pink">.</span>
                </h1>
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
