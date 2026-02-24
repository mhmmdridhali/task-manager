"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, Undo2 } from "lucide-react";

interface ToastMessage {
    id: string;
    message: string;
    type: "success" | "error" | "info";
    undoAction?: () => void;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastMessage["type"], undoAction?: () => void) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be inside ToastProvider");
    return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastMessage["type"] = "success", undoAction?: () => void) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type, undoAction }]);
        const duration = undoAction ? 5000 : 3000; // longer for undo toasts
        setTimeout(() => removeToast(id), duration);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => {
                    const bgColor =
                        toast.type === "success" ? "bg-neo-green"
                            : toast.type === "error" ? "bg-neo-red"
                                : "bg-neo-cyan";

                    return (
                        <div
                            key={toast.id}
                            className={`
                pointer-events-auto flex items-center gap-3 pl-4 pr-2 py-2.5
                neo-border neo-shadow-sm ${bgColor}
                font-sans text-sm font-medium text-neo-black
                animate-fade-in-up
              `}
                            role="alert"
                        >
                            <span className="flex-1">{toast.message}</span>

                            {/* Undo button */}
                            {toast.undoAction && (
                                <button
                                    onClick={() => {
                                        toast.undoAction?.();
                                        removeToast(toast.id);
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 neo-border bg-neo-white hover:bg-neo-yellow transition-colors cursor-pointer font-heading font-bold text-xs"
                                >
                                    <Undo2 size={12} strokeWidth={3} />
                                    Undo
                                </button>
                            )}

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-neo-black/10 transition-colors cursor-pointer"
                            >
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}
