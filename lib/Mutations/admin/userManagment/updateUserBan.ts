import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateUserBan = () => {
    
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ userId, banned }: { userId: string; banned: boolean }) => {
            const response = await fetch(`/api/admin/users/${userId}/ban`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ banned })
            });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }
    })
};