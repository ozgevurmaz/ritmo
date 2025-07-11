import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("reset_logs")
    .select("id")
    .eq("status", "in_progress")
    .gte("created_at", new Date(Date.now() - 30 * 60 * 1000).toISOString())
    .limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inProgress: data.length > 0 });
}
