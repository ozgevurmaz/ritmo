//@ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DateTime } from "https://esm.sh/luxon";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  global: {
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`
    }
  },
  auth: { persistSession: false }
});

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {triggered_by} = body

    // 1. Fetch all users from profiles table
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, timezone");

    if (error) {
      console.error("Failed to fetch users:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
        headers: corsHeaders,
        status: 500
      });
    }
    const utcNow = DateTime.utc();

    console.log(`Scanning ${users.length} users...`);
    const userIdsToReset: string[] = [];

    for (const user of users) {
      const timezone = user.timezone || "UTC";

      try {
        const userLocalTime = utcNow.setZone(timezone);
        const formattedTime = userLocalTime.toFormat("HH:mm");

        if (formattedTime === "00:00") {
          userIdsToReset.push(user.id);
          console.log(`Activity's going to be reset for ${user.id}`);
        }
      } catch (e) {
        console.warn(`Invalid timezone "${timezone}" for user ${user.id}`);
      }
    }

    if (userIdsToReset.length > 0) {
      const response = await fetch(`${supabaseUrl}/functions/v1/daily-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({
          userIds: userIdsToReset,
          reset_type: triggered_by,
        })
      });

      const result = await response.json();
      console.log("Reset response:", result);
    } else {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Triggered successfully, couldn't find user to reset",
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Triggered daily reset function"
    }), {
      headers: corsHeaders,
      status: 200
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : String(error)
    }), {
      headers: corsHeaders,
      status: 500
    });
  }
});
