// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DateTime } from "https://esm.sh/luxon";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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

    // 1. Fetch all users from profiles table
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email, timezone");

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

    if(userIdsToReset.length>0){
      console.log("Activities resetted for ")
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
      error: error instanceof Error ? error.message : String(error)
    }), {
      headers: corsHeaders,
      status: 500
    });
  }
});
