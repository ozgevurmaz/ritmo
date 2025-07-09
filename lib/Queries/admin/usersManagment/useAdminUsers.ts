import { useQuery } from "@tanstack/react-query";

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/admin-users");
      if (!res.ok) throw new Error("Failed to fetch admin users");
      return res.json();
    },
  });
};
