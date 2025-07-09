import { useMutation } from "@tanstack/react-query";

export const useSendPasswordReset = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const response = await fetch('/api/admin/send-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            return response.json();
        },
        onSuccess: () => {
            alert('Password reset email sent successfully');
        }
    })
};