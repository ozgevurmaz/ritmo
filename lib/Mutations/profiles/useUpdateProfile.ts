import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateProfile = (userId: string) => {
    const supabase = createClient();

    return useMutation({
        mutationFn: async ({
            updates
        }: {
            updates: Partial<UserType>;
        }) => {
            const { error } = await supabase
                .from("profiles")
                .update(updates)
                .eq("id", userId)

            if (error) throw new Error(error.message);
        }
    })
}