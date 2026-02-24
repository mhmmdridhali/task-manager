"use client";

interface ProgressBarProps {
    completed: number;
    total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <p className="font-heading text-sm font-bold text-neo-black">Progress Hari Ini</p>
                <p className="font-heading text-sm font-bold text-neo-black/60">{pct}%</p>
            </div>
            <div className="w-full neo-border bg-neo-gray overflow-hidden h-8">
                <div
                    className="h-full bg-neo-green flex items-center justify-center transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(pct, 8)}%` }}
                >
                    <span className="font-heading text-xs font-bold text-neo-black px-2">
                        {completed}/{total}
                    </span>
                </div>
            </div>
        </div>
    );
}
