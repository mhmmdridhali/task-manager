import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            return NextResponse.json({ userCount: 0, taskCount: 0 });
        }

        const supabaseAdmin = createClient(url, key, {
            auth: { persistSession: false },
        });

        // Count total registered users via RPC
        const { data: userCount } = await supabaseAdmin.rpc("get_user_count");

        // Count total tasks
        const { count: taskCount } = await supabaseAdmin
            .from("tasks")
            .select("*", { count: "exact", head: true });

        return NextResponse.json({
            userCount: userCount || 0,
            taskCount: taskCount || 0,
        });
    } catch {
        return NextResponse.json({ userCount: 0, taskCount: 0 });
    }
}
