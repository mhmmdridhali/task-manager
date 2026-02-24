"use client";

import { useMemo, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "@/lib/types";

interface CalendarWidgetProps {
    tasks: Task[];
    onSelectDate?: (date: string | null) => void;
    selectedDate?: string | null;
}

export default function CalendarWidget({ tasks, onSelectDate, selectedDate }: CalendarWidgetProps) {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [tooltip, setTooltip] = useState<{ day: number; x: number; y: number; tasks: Task[]; holidayName?: string } | null>(null);
    const [holidays, setHolidays] = useState<Array<{ date: string; name: string }>>([]);
    const calendarRef = useRef<HTMLDivElement>(null);

    // Fetch Indonesian Public Holidays
    useMemo(() => {
        fetch(`https://libur.deno.dev/api?year=${viewYear}&month=${viewMonth + 1}`)
            .then(res => res.json())
            .then(data => Array.isArray(data) ? setHolidays(data) : setHolidays([]))
            .catch(() => setHolidays([]));
    }, [viewMonth, viewYear]);

    const { daysInMonth, startDay, dueDateMap, tasksByDay } = useMemo(() => {
        const dim = new Date(viewYear, viewMonth + 1, 0).getDate();
        const sd = new Date(viewYear, viewMonth, 1).getDay();
        const ddMap = new Map<number, number>();
        const tbd = new Map<number, Task[]>();
        tasks.forEach((t) => {
            if (t.dueDate) {
                const d = new Date(t.dueDate);
                if (d.getMonth() === viewMonth && d.getFullYear() === viewYear) {
                    ddMap.set(d.getDate(), (ddMap.get(d.getDate()) || 0) + 1);
                    if (!tbd.has(d.getDate())) tbd.set(d.getDate(), []);
                    tbd.get(d.getDate())!.push(t);
                }
            }
        });
        return { daysInMonth: dim, startDay: sd, dueDateMap: ddMap, tasksByDay: tbd };
    }, [tasks, viewYear, viewMonth]);

    const monthName = new Date(viewYear, viewMonth).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
        else setViewMonth(viewMonth - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
        else setViewMonth(viewMonth + 1);
    };

    const handleDayClick = (day: number) => {
        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        onSelectDate?.(selectedDate === dateStr ? null : dateStr);
    };

    const handleDayHover = (day: number, e: React.MouseEvent) => {
        const dayTasks = tasksByDay.get(day);
        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const holiday = holidays.find(h => h.date === dateStr);

        if ((!dayTasks || dayTasks.length === 0) && !holiday) { setTooltip(null); return; }

        const rect = calendarRef.current?.getBoundingClientRect();
        const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        if (!rect) return;

        setTooltip({
            day,
            x: targetRect.left - rect.left + targetRect.width / 2,
            y: targetRect.top - rect.top,
            tasks: dayTasks || [],
            holidayName: holiday?.name
        });
    };

    const isToday = (day: number) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

    return (
        <div ref={calendarRef} className="neo-border neo-shadow-sm bg-neo-white p-4 mb-6 relative transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--neo-black)] cursor-default">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center neo-border bg-neo-bg hover:bg-neo-gray transition-colors cursor-pointer">
                    <ChevronLeft size={14} strokeWidth={3} />
                </button>
                <h3 className="font-heading text-sm font-bold text-neo-black capitalize">{monthName}</h3>
                <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center neo-border bg-neo-bg hover:bg-neo-gray transition-colors cursor-pointer">
                    <ChevronRight size={14} strokeWidth={3} />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {dayNames.map((d, i) => (
                    <div key={d} className={`text-center font-heading text-[10px] font-bold py-1 ${i === 0 ? "text-neo-red" : i === 5 ? "text-neo-green" : "text-neo-black/40"}`}>{d}</div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDay }).map((_, i) => (<div key={`empty-${i}`} className="h-7" />))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dueCount = dueDateMap.get(day) || 0;
                    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSelected = selectedDate === dateStr;
                    const isPast = new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const holiday = holidays.find(h => h.date === dateStr);
                    const dayOfWeek = new Date(viewYear, viewMonth, day).getDay();

                    return (
                        <button
                            key={day}
                            onClick={() => handleDayClick(day)}
                            onMouseEnter={(e) => handleDayHover(day, e)}
                            onMouseLeave={() => setTooltip(null)}
                            className={`
                h-7 flex items-center justify-center text-xs font-heading font-bold relative
                transition-all cursor-pointer
                ${isToday(day) ? "bg-neo-yellow neo-border text-neo-black"
                                    : isSelected ? "bg-neo-cyan neo-border text-neo-black"
                                        : holiday ? "bg-neo-red/20 text-neo-red"
                                            : dueCount > 0 ? "bg-neo-pink/30 hover:bg-neo-pink/50 text-neo-black"
                                                : isPast ? "text-neo-black/20 hover:bg-neo-gray"
                                                    : dayOfWeek === 0 ? "text-neo-red hover:bg-neo-gray"
                                                        : dayOfWeek === 5 ? "text-neo-green hover:bg-neo-gray"
                                                            : "text-neo-black/60 hover:bg-neo-gray"
                                }
              `}
                        >
                            {day}
                            {dueCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-neo-red text-neo-white text-[8px] font-bold flex items-center justify-center neo-border border-[1px]">
                                    {dueCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-3 text-[10px] font-sans text-neo-black/50">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-neo-yellow neo-border border-[1px]" /> Hari ini</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-neo-pink/30 neo-border border-[1px]" /> Deadline</span>
                {selectedDate && (
                    <button onClick={() => onSelectDate?.(null)} className="text-neo-cyan font-bold hover:underline cursor-pointer ml-auto">Reset filter</button>
                )}
            </div>

            {/* Hover Tooltip */}
            {tooltip && (
                <div
                    className="absolute z-50 w-52 neo-border neo-shadow-sm bg-neo-white p-3 pointer-events-none"
                    style={{
                        left: Math.min(Math.max(tooltip.x - 104, 0), 200),
                        top: tooltip.y - 8,
                        transform: "translateY(-100%)",
                    }}
                >
                    <p className="font-heading text-xs font-bold text-neo-black mb-2 border-b-2 border-neo-black/10 pb-1">
                        {tooltip.day} {monthName}
                    </p>
                    {tooltip.holidayName && (
                        <p className="text-neo-red font-bold text-[10px] mb-2">{tooltip.holidayName}</p>
                    )}
                    <ul className="space-y-1">
                        {tooltip.tasks.slice(0, 4).map((t) => (
                            <li key={t.id} className="flex items-start gap-1.5">
                                <span className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 rounded-full ${t.completed ? "bg-neo-green" : "bg-neo-red"}`} />
                                <span className={`font-sans text-[11px] leading-tight ${t.completed ? "line-through text-neo-black/40" : "text-neo-black"}`}>
                                    {t.title}
                                </span>
                            </li>
                        ))}
                        {tooltip.tasks.length > 4 && (
                            <li className="font-sans text-[10px] text-neo-black/40">+{tooltip.tasks.length - 4} lainnya</li>
                        )}
                        {tooltip.tasks.length === 0 && (
                            <li className="font-sans text-[10px] text-neo-black/40 italic">Tidak ada tugas deadline</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
