// ========================================
// CORE APPLICATION TYPES
// ========================================

export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "active" | "completed";
export type SortOption = "newest" | "oldest" | "priority" | "alphabetical";

export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface BoardList {
    id: string;
    title: string;
    color: string;
    position: number;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: Priority;
    categoryId?: string;
    listId: string;        // "overdue" | "todo" | "done"
    description?: string;
    dueDate?: string;
    createdAt: string;
    position: number;
}

export interface ToastMessage {
    id: string;
    message: string;
    type: "success" | "error" | "info";
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
    low: { label: "Rendah", color: "bg-neo-green" },
    medium: { label: "Sedang", color: "bg-neo-yellow" },
    high: { label: "Tinggi", color: "bg-neo-red" },
};

export const DEFAULT_LISTS: BoardList[] = [
    { id: "overdue", title: "Due Task", color: "bg-neo-red/40", position: 0 },
    { id: "todo", title: "To Do", color: "bg-neo-yellow", position: 1 },
    { id: "done", title: "Done", color: "bg-neo-green", position: 2 },
];

export const DEFAULT_CATEGORIES: Category[] = [
    { id: "work", name: "Kerja", color: "bg-neo-cyan" },
    { id: "personal", name: "Pribadi", color: "bg-neo-pink" },
    { id: "study", name: "Belajar", color: "bg-neo-yellow" },
    { id: "health", name: "Kesehatan", color: "bg-neo-green" },
];
