import { useQuery } from "@tanstack/react-query";

export const useUserLogs = () => {
    return useQuery({
        queryKey: ["activity-logs"],
        queryFn: async () => {
            const res = await fetch("/api/admin/user-logs");
            if (!res.ok) throw new Error("Failed to fetch admin users");
            return res.json();
        },
    });
};
