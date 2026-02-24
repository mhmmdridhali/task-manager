"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export default function LiveStats() {
    const [userCount, setUserCount] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch("/api/stats")
            .then((r) => r.json())
            .then((data) => {
                setUserCount(data.userCount || 0);
                setLoaded(true);
            })
            .catch(() => setLoaded(true));
    }, []);

    return (
        <div className="flex justify-center mt-10">
            <div className="flex items-center gap-3 px-5 py-3 neo-border neo-shadow-sm bg-neo-white hover:-translate-y-1 transition-transform">
                <div className="p-2 bg-neo-cyan neo-border">
                    <Users size={20} strokeWidth={2.5} className="text-neo-black" />
                </div>
                <div>
                    <p className={`font-heading font-bold text-2xl text-neo-black tabular-nums transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}>
                        {userCount.toLocaleString("id-ID")}+
                    </p>
                    <p className="font-sans text-xs text-neo-black/50 font-medium">Pengguna Terdaftar</p>
                </div>
            </div>
        </div>
    );
}
