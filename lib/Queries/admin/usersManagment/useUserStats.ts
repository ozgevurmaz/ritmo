import { useQuery } from "@tanstack/react-query";

export const useUserStats = () => {
    return useQuery({
        queryKey: ["user-stats"],
        queryFn: async () => {
            const res = await fetch("/api/admin/user-stats");
            if (!res.ok) throw new Error("Failed to fetch admin users");
            return res.json();
        },
    });
};
