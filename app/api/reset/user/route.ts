import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();

  try {
    const { userIds } = await req.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return new Response("Invalid input", { status: 400 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/daily-reset`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        userIds: userIds,
        reset_type: "Reset Managment Page"
      }),
    });

    const result = await response.json();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Habits and goals reseted successfully.",
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    return new NextResponse(JSON.stringify({
      message: error instanceof Error ? error.message : String(error)
    }), {
      headers: corsHeaders,
      status: 500
    });
  }
}