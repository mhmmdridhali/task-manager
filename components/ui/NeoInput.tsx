import React, { forwardRef } from "react";

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(
    ({ label, className = "", id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="font-heading font-bold text-neo-black text-sm"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-3
            font-sans text-neo-black text-base
            bg-neo-white
            neo-border neo-shadow-sm
            placeholder:text-neo-black/40
            transition-all duration-150 ease-in-out
            focus:outline-none focus:shadow-[3px_3px_0px_0px_var(--neo-cyan)] focus:border-[var(--neo-cyan)]
            ${className}
          `}
                    {...props}
                />
            </div>
        );
    }
);

NeoInput.displayName = "NeoInput";

export default NeoInput;
