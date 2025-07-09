import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useDeleteUser = () => {

    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }
    })
};