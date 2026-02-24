"use client";

import { useEffect, useCallback } from "react";

interface UseKeyboardShortcutsProps {
    onNewTask?: () => void;
    onSearch?: () => void;
    onToggleTheme?: () => void;
}

export function useKeyboardShortcuts({
    onNewTask,
    onSearch,
    onToggleTheme,
}: UseKeyboardShortcutsProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Ignore if user is typing in an input/textarea
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case "n":
                    e.preventDefault();
                    onNewTask?.();
                    break;
                case "/":
                    e.preventDefault();
                    onSearch?.();
                    break;
                case "d":
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        onToggleTheme?.();
                    }
                    break;
            }
        },
        [onNewTask, onSearch, onToggleTheme]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
}
