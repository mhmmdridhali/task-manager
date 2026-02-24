"use client";

// ThemeProvider stripped — dark mode removed, neobrutalism is light-only.
// Kept as a simple pass-through for layout compatibility.

import type { ReactNode } from "react";

export function useTheme() {
    return { theme: "light" as const, toggleTheme: () => { } };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
