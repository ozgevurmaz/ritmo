import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
}