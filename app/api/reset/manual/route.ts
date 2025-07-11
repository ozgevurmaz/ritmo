import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.functions.invoke('cron-trigger', {
    method:"POST",
    body: {
      triggered_by: ' ',
      timestamp: new Date().toISOString(),
    },
  });
  console.log(data)
  if (error) {
    console.error("❌ Daily reset failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}
