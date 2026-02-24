export default function DashboardLoading() {
    return (
        <div className="p-6 md:p-10 animate-pulse">
            {/* Header skeleton */}
            <div className="mb-8">
                <div className="h-10 w-64 bg-neo-gray neo-border mb-2" />
                <div className="h-5 w-48 bg-neo-gray neo-border" />
            </div>

            {/* Input skeleton */}
            <div className="flex gap-3 mb-8">
                <div className="flex-1 h-14 bg-neo-gray neo-border" />
                <div className="w-32 h-14 bg-neo-yellow/40 neo-border" />
            </div>

            {/* Filter tabs skeleton */}
            <div className="flex gap-2 mb-6">
                <div className="h-11 w-28 bg-neo-yellow/40 neo-border" />
                <div className="h-11 w-28 bg-neo-gray neo-border" />
                <div className="h-11 w-28 bg-neo-gray neo-border" />
            </div>

            {/* Task items skeleton */}
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 p-4 neo-border bg-neo-gray"
                        style={{ opacity: 1 - i * 0.15 }}
                    >
                        <div className="w-6 h-6 bg-neo-white neo-border flex-shrink-0" />
                        <div className="flex-1 h-5 bg-neo-white/60 neo-border" />
                        <div className="w-8 h-8 bg-neo-white/40 neo-border flex-shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}
