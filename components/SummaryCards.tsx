"use client";

import { ClipboardList, Flame, CheckCircle2, BarChart3 } from "lucide-react";

interface SummaryCardsProps {
    total: number;
    active: number;
    completed: number;
}

export default function SummaryCards({ total, active, completed }: SummaryCardsProps) {
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const cards = [
        { label: "Total Tugas", value: total, icon: ClipboardList, color: "bg-neo-white" },
        { label: "Aktif", value: active, icon: Flame, color: "bg-neo-yellow" },
        { label: "Selesai", value: completed, icon: CheckCircle2, color: "bg-neo-green" },
        { label: "Progress", value: `${progress}%`, icon: BarChart3, color: "bg-neo-cyan" },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.label}
                        className={`p-4 neo-border neo-shadow-sm ${card.color} hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--neo-black)] transition-all`}
                    >
                        <Icon size={18} strokeWidth={2.5} className="text-neo-black/60 mb-2" />
                        <p className="font-heading text-2xl font-bold text-neo-black">{card.value}</p>
                        <p className="font-sans text-xs text-neo-black/50">{card.label}</p>
                    </div>
                );
            })}
        </div>
    );
}
