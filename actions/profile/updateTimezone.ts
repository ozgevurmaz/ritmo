import { createClient } from "@/lib/supabase/client";
import { getTimezone } from "@/lib/utils/user/getTimeZone";

export async function checkAndUpdateTimezone(userId: string): Promise<void> {
    const currentTimezone = getTimezone();
    const supabase = createClient();

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("timezone")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Couldn't find the user:", error.message);
        return;
    }

    if (profile.timezone !== currentTimezone) {
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ timezone: currentTimezone })
            .eq("id", userId);

        if (updateError) {
            console.error("Couldn't update timezone:", updateError.message);
        } else {
            console.log("Timezone updated:", currentTimezone);
        }
    }
}