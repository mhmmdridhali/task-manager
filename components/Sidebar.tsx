"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Columns3,
    Tag,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Assign specific colors for hover states to each menu item
// NOTE: hoverClass must be a full static string so Tailwind JIT can detect and generate it
const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, hoverColor: "bg-neo-yellow", hoverClass: "hover:bg-neo-yellow" },
    { href: "/dashboard/board", label: "Kanban Board", icon: Columns3, hoverColor: "bg-neo-cyan", hoverClass: "hover:bg-neo-cyan" },
    { href: "/dashboard/categories", label: "Kategori", icon: Tag, hoverColor: "bg-neo-pink", hoverClass: "hover:bg-neo-pink" },
    { href: "/dashboard/settings", label: "Pengaturan", icon: Settings, hoverColor: "bg-neo-green", hoverClass: "hover:bg-neo-green" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);

    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    const NavContent = ({ isExpanded }: { isExpanded: boolean }) => (
        <div className="flex flex-col h-full bg-neo-white">
            {/* Logo */}
            <div className={`p-4 flex items-center mb-2 h-16 border-b-[3px] border-neo-black ${isExpanded ? "justify-start gap-2" : "justify-center"}`}>
                <Image src="/logo.svg" alt="Taskly Logo" width={isExpanded ? 28 : 32} height={isExpanded ? 28 : 32} className="drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-shrink-0" />
                {isExpanded && (
                    <Link href="/dashboard" className="font-heading text-2xl font-bold text-neo-black flex items-center min-w-0">
                        Taskly<span className="text-neo-pink">.</span>
                    </Link>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col overflow-y-auto px-4 py-4 space-y-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            title={!isExpanded ? item.label : undefined}
                            className={`flex items-center ${isExpanded ? "px-4 justify-start" : "justify-center px-0"} py-3 neo-border font-heading font-bold text-sm transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${active
                                ? `${item.hoverColor} shadow-none translate-x-[2px] translate-y-[2px]`
                                : `bg-neo-white neo-shadow-sm ${item.hoverClass}`
                                }`}
                        >
                            <div className="flex items-center justify-center w-6 h-6 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Icon size={20} strokeWidth={2.5} />
                            </div>
                            {isExpanded && <span className="ml-3 truncate">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 bg-neo-white mt-auto">
                <button
                    onClick={handleLogout}
                    title={!isExpanded ? "Keluar" : undefined}
                    className={`w-full flex items-center ${isExpanded ? "px-4 justify-start" : "px-0 justify-center"} py-3 neo-border bg-neo-white hover:bg-neo-red hover:text-neo-white neo-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all font-heading font-bold text-sm cursor-pointer whitespace-nowrap overflow-hidden group`}
                >
                    <div className="flex items-center justify-center w-6 h-6 flex-shrink-0 group-hover:scale-110 transition-transform text-neo-red group-hover:text-neo-white">
                        <LogOut size={20} strokeWidth={2.5} />
                    </div>
                    {isExpanded && <span className="ml-3 text-neo-red group-hover:text-neo-white transition-colors">Keluar</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile toggle (Hamburger) - Moved to TOP RIGHT */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden fixed top-3 right-3 z-[60] w-10 h-10 neo-border bg-neo-yellow hover:bg-neo-yellow/80 flex items-center justify-center cursor-pointer neo-shadow-sm transition-transform active:translate-y-1"
                aria-label="Toggle Menu"
            >
                {isMobileOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
            </button>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 bg-neo-black/40 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileOpen(false)} />
            )}

            {/* Desktop sidebar */}
            <aside
                className={`hidden md:flex flex-col border-r-[3px] border-neo-black bg-neo-white flex-shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out relative ${isDesktopExpanded ? "w-64" : "w-20"}`}
            >
                <NavContent isExpanded={isDesktopExpanded} />

                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setIsDesktopExpanded(!isDesktopExpanded)}
                    className="absolute -right-3.5 top-20 w-7 h-7 bg-neo-white neo-border flex items-center justify-center cursor-pointer hover:bg-neo-yellow transition-colors neo-shadow-sm z-10 rounded-full"
                    title={isDesktopExpanded ? "Tutup Sidebar" : "Buka Sidebar"}
                >
                    {isDesktopExpanded ? <ChevronLeft size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
                </button>
            </aside>

            {/* Mobile sidebar */}
            <aside className={`md:hidden fixed top-0 left-0 z-50 w-64 h-screen bg-neo-white border-r-[3px] border-neo-black transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="pt-2 h-full"> {/* Less padding top needed since hamburger is right */}
                    <NavContent isExpanded={true} />
                </div>
            </aside>
        </>
    );
}
