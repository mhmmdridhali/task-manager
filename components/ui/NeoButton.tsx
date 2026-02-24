import React from "react";

type NeoButtonVariant = "yellow" | "cyan" | "pink" | "green" | "orange" | "white";

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: NeoButtonVariant;
    children: React.ReactNode;
}

const variantColors: Record<NeoButtonVariant, string> = {
    yellow: "bg-neo-yellow",
    cyan: "bg-neo-cyan",
    pink: "bg-neo-pink",
    green: "bg-neo-green",
    orange: "bg-neo-orange",
    white: "bg-neo-white",
};

export default function NeoButton({
    variant = "yellow",
    children,
    className = "",
    disabled,
    ...props
}: NeoButtonProps) {
    return (
        <button
            className={`
        font-heading font-bold text-neo-black
        px-6 py-3 
        neo-border neo-shadow
        transition-all duration-150 ease-in-out
        cursor-pointer select-none
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--neo-black)]
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_var(--neo-black)]
        ${variantColors[variant]}
        ${className}
      `}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
