"use client";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ClipboardList } from "lucide-react";
import type { Task } from "@/lib/types";
import TaskItemCard from "@/components/TaskItemCard";

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, newTitle: string) => void;
    onReorder?: (activeId: string, overId: string) => void;
}

export default function TaskList({
    tasks,
    onToggle,
    onDelete,
    onEdit,
    onReorder,
}: TaskListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            onReorder?.(active.id as string, over.id as string);
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <ClipboardList size={48} strokeWidth={1.5} className="text-neo-black/20 mb-4" />
                <h3 className="font-heading text-2xl font-bold text-neo-black mb-2">
                    Belum ada tugas!
                </h3>
                <p className="font-sans text-base text-neo-black/50 max-w-sm">
                    Mulai hari produktifmu dengan menambahkan tugas pertama di kolom atas.
                </p>
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2">
                    {tasks.map((task) => (
                        <TaskItemCard
                            key={task.id}
                            task={task}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
