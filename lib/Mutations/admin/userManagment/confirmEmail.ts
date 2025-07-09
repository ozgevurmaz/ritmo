import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useConfirmEmail = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await fetch(`/api/admin/users/${userId}/confirm-email`, {
                method: 'POST'
            });
            return response.json();
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }
    })
};