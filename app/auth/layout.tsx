import { ToastProvider } from "@/components/ToastProvider";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            {children}
        </ToastProvider>
    );
}
