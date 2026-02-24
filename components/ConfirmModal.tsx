"use client";

import NeoButton from "@/components/ui/NeoButton";
import NeoCard from "@/components/ui/NeoCard";
import { Trash2, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: "danger" | "warning";
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = "Ya, hapus!",
    cancelLabel = "Batal",
    onConfirm,
    onCancel,
    variant = "danger",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neo-black/40" onClick={onCancel} />
            <div className="relative z-10 animate-bounce-in">
                <NeoCard color="white" className="max-w-sm w-full p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 neo-border bg-neo-red/20 flex items-center justify-center">
                        {variant === "danger"
                            ? <Trash2 size={28} strokeWidth={2} className="text-neo-black" />
                            : <AlertTriangle size={28} strokeWidth={2} className="text-neo-black" />
                        }
                    </div>
                    <h3 className="font-heading text-xl font-bold text-neo-black mb-2">{title}</h3>
                    <p className="font-sans text-sm text-neo-black/60 mb-6">{message}</p>
                    <div className="flex gap-3 justify-center">
                        <NeoButton variant="white" onClick={onCancel}>{cancelLabel}</NeoButton>
                        <NeoButton variant={variant === "danger" ? "pink" : "orange"} onClick={onConfirm}>{confirmLabel}</NeoButton>
                    </div>
                </NeoCard>
            </div>
        </div>
    );
}
