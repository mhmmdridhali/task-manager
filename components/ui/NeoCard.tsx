import React from "react";

type NeoCardColor = "yellow" | "cyan" | "pink" | "green" | "orange" | "white" | "bg";

interface NeoCardProps {
    children: React.ReactNode;
    color?: NeoCardColor;
    className?: string;
    hover?: boolean;
}

const colorMap: Record<NeoCardColor, string> = {
    yellow: "bg-neo-yellow",
    cyan: "bg-neo-cyan",
    pink: "bg-neo-pink",
    green: "bg-neo-green",
    orange: "bg-neo-orange",
    white: "bg-neo-white",
    bg: "bg-neo-bg",
};

export default function NeoCard({
    children,
    color = "white",
    className = "",
    hover = false,
}: NeoCardProps) {
    return (
        <div
            className={`
        p-6
        neo-border neo-shadow
        transition-all duration-150 ease-in-out
        ${hover ? "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--neo-black)] cursor-pointer" : ""}
        ${colorMap[color]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
