import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = createAdminClient();

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || 50);

  const { data, error } = await supabase
    .from("reset_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
