import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createAdminClient();

  const { data, error } = await supabase.functions.invoke("trigger-daily-reset", {
    body: { triggered_by: "manual" },
  })

  if (error) {
    console.error("Daily reset failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      message: "Triggered successfully, couldn't find user to reset",
    }
    , { status: 200 });
}
