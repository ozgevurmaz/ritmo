"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Users,
    Search,
    Ban,
    UserCheck,
    Calendar,
} from 'lucide-react';
import Loading from '../customs/loading';
import { useAdminUsers } from '@/lib/Queries/admin/usersManagment/useAdminUsers';
import { useUserStats } from '@/lib/Queries/admin/usersManagment/useUserStats';
import { SearchFormData, searchSchema } from '@/lib/zod/admin/usersDashboard/searchForm';
import PageHeader from '../customs/header';
import StatCard from '../customs/statCard';
import UserDetailsModal from '../modals/userDetailsModal';
import ActivityLogsModal from '../modals/ActivityLogsModal';
import { UserManagementTable } from './userTable';


const UserManagement: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // Form setup
    const searchForm = useForm<SearchFormData>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            query: '',
            status: 'all',
            provider: 'all'
        }
    });

    // Queries
    const { data: users } = useAdminUsers();
    const { data: userStats } = useUserStats()

    // Loading state
    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <PageHeader pageIcon={Users} title='User Management' subtitle='Manage Ritmo users and monitor activity' />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    text="Total Users"
                    stat={String(userStats?.totalUsers || 0)}
                    icon={Users}
                    iconColor="text-primary"
                />
                <StatCard
                    text="Active Users"
                    stat={String(userStats?.activeUsers || 0)}
                    icon={UserCheck}
                    iconColor="text-success"
                />
                <StatCard
                    text="Banned Users"
                    stat={String(userStats?.bannedUsers || 0)}
                    icon={Ban}
                    iconColor="text-destructive"
                />
                <StatCard
                    text="New This Week"
                    stat={String(userStats?.newUsersThisWeek || 0)}
                    icon={Calendar}
                    iconColor="text-accent"
                />

            </div>

            {/* Search and Filters */}
            <div
                className="rounded-lg p-6 mb-8 border"
                style={{
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-border)'
                }}
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                                style={{ color: 'var(--color-muted-foreground)' }} />
                            <input
                                type="text"
                                placeholder="Search users by name, email, or username..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                style={{
                                    borderColor: 'var(--color-input-border)',
                                    backgroundColor: 'var(--color-input)',
                                    color: 'var(--color-foreground)'
                                }}
                                {...searchForm.register('query')}
                            />
                        </div>
                    </div>

                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        style={{
                            borderColor: 'var(--color-input-border)',
                            backgroundColor: 'var(--color-input)',
                            color: 'var(--color-foreground)'
                        }}
                        {...searchForm.register('status')}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                        <option value="unconfirmed">Unconfirmed</option>
                    </select>

                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        style={{
                            borderColor: 'var(--color-input-border)',
                            backgroundColor: 'var(--color-input)',
                            color: 'var(--color-foreground)'
                        }}
                        {...searchForm.register('provider')}
                    >
                        <option value="all">All Providers</option>
                        <option value="email">Email</option>
                        <option value="google">Google</option>
                        <option value="github">GitHub</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <UserManagementTable
                users={users}
                showUserDetails={
                    (user: AdminUser) => {
                        setSelectedUser(user)
                        setShowUserDetails(true)
                    }
                }
                showUserLogs={
                    (user: AdminUser) => {
                        setSelectedUser(user)
                        setShowLogs(true)
                    }
                }
            />

            {/* User Details Modal */}
            <UserDetailsModal
                user={selectedUser}
                showUserDetails={showUserDetails}
                setShowUserDetails={setShowUserDetails}
                setSelectedUser={setSelectedUser}
            />

            {/* Activity Logs Modal */}
            {
                selectedUser
                &&
                <ActivityLogsModal
                    user={selectedUser}
                    showLogs={showLogs}
                    setShowLogs={setShowLogs}
                />
            }
        </div>
    );
};

export default UserManagement;