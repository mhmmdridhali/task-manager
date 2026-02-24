"use client";

import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "@/components/ToastProvider";

import { motion } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-neo-bg flex">
                <Sidebar />
                <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
                    <motion.div
                        key="dashboard-content"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex-1 overflow-y-auto"
                    >
                        {children}
                    </motion.div>
                    {/* Footer */}
                    <footer className="px-6 py-3 border-t-[3px] border-neo-black bg-neo-white text-center flex-shrink-0 z-10 relative">
                        <p className="font-sans text-xs text-neo-black/60 font-bold">
                            Dibuat oleh <span className="text-neo-black bg-neo-yellow px-1 underline decoration-neo-pink decoration-2">Muhammad Ali Ridho</span> &mdash; Taskly<span className="text-neo-pink">.</span> v1.0
                        </p>
                    </footer>
                </div>
            </div>
        </ToastProvider>
    );
}
