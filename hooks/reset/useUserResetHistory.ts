import { EdgeFunctionManager } from "@/lib/utils/edgeFunctions/edgeFunctions";
import { useQuery } from "@tanstack/react-query";

export const useUserResetHistory = (userId: string, limit: number = 10) => {
    return useQuery({
        queryKey: ['userResetHistory', userId, limit],
        queryFn: async () => {
            const res = await fetch("/api/reset/user-history");
            return await res.json();
        },
        enabled: !!userId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};
