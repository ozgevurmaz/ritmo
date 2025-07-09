"use client";

import React from 'react';
import { X, Key, CheckCircle, UserCheck, Ban, Trash2 } from 'lucide-react';
import { formatSupabaseDate } from '@/lib/utils/date/formatDate';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useConfirmEmail } from '@/lib/Mutations/admin/userManagment/confirmEmail';
import { useDeleteUser } from '@/lib/Mutations/admin/userManagment/deleteUser';
import { useSendPasswordReset } from '@/lib/Mutations/admin/userManagment/sendPasswordReset';
import { useUpdateUserBan } from '@/lib/Mutations/admin/userManagment/updateUserBan';
import { getStatusColor } from '@/lib/utils/admin/userManagment/statusColor';
import ProfilePhoto from '@/components/shared/profilePhoto';
import { Button } from '@/components/ui/button';

interface Props {
    user: AdminUser | null;
    showUserDetails: boolean;
    setShowUserDetails: (show: boolean) => void;
    setSelectedUser: (user: AdminUser | null) => void;
}

const UserDetailsModal: React.FC<Props> = ({
    user,
    showUserDetails,
    setShowUserDetails,
    setSelectedUser,
}) => {
    // Hooks
    const { mutate: sendPasswordReset, isPending: isPendingSendPasswordReset } = useSendPasswordReset();
    const { mutate: updateUserBan, isPending: isPendingUpdateUserBan } = useUpdateUserBan();
    const { mutate: deleteUser, isPending: isPendingDeleteUser } = useDeleteUser();
    const { mutate: confirmEmail, isPending: isPendingConfirmEmail } = useConfirmEmail();

    // Helper functions
    const getUserStatus = (user: AdminUser): 'active' | 'banned' | 'unconfirmed' => {
        if (user.banned_until && new Date(user.banned_until) > new Date()) {
            return 'banned';
        }
        if (!user.email_confirmed_at) {
            return 'unconfirmed';
        }
        return 'active';
    };

    // Event handlers
    const handleSendPasswordReset = (user: AdminUser) => {
        sendPasswordReset(user.email);
    };

    const handleToggleBan = (user: AdminUser) => {
        const currentStatus = getUserStatus(user);
        const shouldBan = currentStatus !== 'banned';

        updateUserBan({
            userId: user.id,
            banned: shouldBan
        });
    };

    const handleConfirmEmail = (user: AdminUser) => {
        confirmEmail(user.id);
    };

    const handleDeleteUser = (user: AdminUser) => {
        if (window.confirm(`Are you sure you want to delete user ${user.email}? This action cannot be undone.`)) {
            deleteUser(user.id);
            setSelectedUser(null);
            setShowUserDetails(false);
        }
    };

    const handleClose = () => {
        setShowUserDetails(false);
    };

    if (!user) return null;

    return (
        <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
            <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
            <DialogContent className="bg-card border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex items-center justify-between">
                    <DialogTitle className="text-xl font-bold text-foreground">
                        User Details
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        View the selected user's profile and account activity.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* User Profile Section */}
                    <div className="flex items-center space-x-4">

                        <ProfilePhoto name={user.name} avatarUrl={user.avatar_url} size="lg" />

                        <div>
                            <h3 className="text-lg font-semibold text-foreground">
                                {user.name || 'Unknown User'}
                            </h3>
                            {user.username && (
                                <p className="text-muted-foreground">@{user.username}</p>
                            )}
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(getUserStatus(user))}`}>
                                {getUserStatus(user)}
                            </span>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Account Info */}
                        <div className="p-4 rounded-lg bg-muted/50 border border-border">
                            <h4 className="font-medium mb-2 text-foreground">Account Info</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Provider:</span>
                                    <span className="text-foreground font-medium">
                                        {user.raw_app_meta_data?.provider || 'email'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email Confirmed:</span>
                                    <span className="text-foreground font-medium">
                                        {user.email_confirmed_at ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Joined:</span>
                                    <span className="text-foreground font-medium">
                                        {formatSupabaseDate(user.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last Sign In:</span>
                                    <span className="text-foreground font-medium">
                                        {formatSupabaseDate(user.last_sign_in_at)}
                                    </span>
                                </div>
                                {user.banned_until && new Date(user.banned_until) > new Date() && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Banned Until:</span>
                                        <span className="text-destructive font-medium">
                                            {formatSupabaseDate(user.banned_until)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="p-4 rounded-lg bg-muted/50 border border-border">
                            <h4 className="font-medium mb-2 text-foreground">Activity Stats</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Habits:</span>
                                    <span className="font-medium">
                                        {user.habits_count || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Goals:</span>
                                    <span className="font-medium">
                                        {user.goals_count || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Friends:</span>
                                    <span className="font-medium">
                                        {user.friends_count || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Streak:</span>
                                    <span className="font-medium">
                                        {user.streak_days || 0} days
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Activities:</span>
                                    <span className="font-medium">
                                        {user.total_activities || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            {/* Send Password Reset */}
                            <Button
                                onClick={() => handleSendPasswordReset(user)}
                                disabled={isPendingSendPasswordReset}
                            >
                                <Key className="w-4 h-4" />
                                <span>
                                    {isPendingSendPasswordReset ? 'Sending...' : 'Send Password Reset'}
                                </span>
                            </Button>

                            {/* Confirm Email or Ban/Unban */}
                            {getUserStatus(user) === 'unconfirmed' ? (
                                <Button
                                    onClick={() => handleConfirmEmail(user)}
                                    disabled={isPendingConfirmEmail}
                                    variant="secondary"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>
                                        {isPendingConfirmEmail ? 'Confirming...' : 'Confirm Email'}
                                    </span>
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleToggleBan(user)}
                                    disabled={isPendingUpdateUserBan}
                                    className={`${getUserStatus(user) === 'banned'
                                        ? 'bg-success text-foreground hover:bg-success/90'
                                        : 'bg-warning text-foreground hover:bg-warning/90'
                                        }`}
                                >
                                    {getUserStatus(user) === 'banned' ? (
                                        <>
                                            <UserCheck className="w-4 h-4" />
                                            <span>
                                                {isPendingUpdateUserBan ? 'Unbanning...' : 'Unban User'}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Ban className="w-4 h-4" />
                                            <span>
                                                {isPendingUpdateUserBan ? 'Banning...' : 'Ban User'}
                                            </span>
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>

                        {/* Delete User */}
                        <Button
                            onClick={() => handleDeleteUser(user)}
                            disabled={isPendingDeleteUser}
                            variant="destructive"
                            className='w-full bg-destructive'
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>
                                {isPendingDeleteUser ? 'Deleting...' : 'Delete User'}
                            </span>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailsModal;