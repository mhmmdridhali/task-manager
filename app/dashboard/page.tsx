import type { Metadata } from "next";
import DashboardClient from "@/components/DashboardClient";

export const metadata: Metadata = {
    title: "Dashboard — Taskly",
    description: "Kelola semua tugasmu di satu tempat.",
};

export default function DashboardPage() {
    return <DashboardClient />;
}
