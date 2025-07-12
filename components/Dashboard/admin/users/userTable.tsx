import ProfilePhoto from "@/components/shared/profilePhoto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStatusColor } from "@/lib/utils/admin/userManagment/statusColor";
import { getDaysAgo } from "@/lib/utils/date/daysago";
import { formatSupabaseDate } from "@/lib/utils/date/formatDate";
import { Activity, Eye} from "lucide-react";

interface TableColumn<T = any> {
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    render: (row: T) => React.ReactNode;
}


export const UserManagementTable = (
    {
        users,
        showUserDetails,
        showUserLogs
    }: {
        users: AdminUser[],
        showUserDetails: (id: AdminUser) => void;
        showUserLogs: (id: AdminUser) => void;
    }
) => {
    const columns: TableColumn<AdminUser>[] = [
        {
            key: 'user',
            label: "User",
            sortable: true,
            width: '200px',
            render: (user: AdminUser) =>
                <div className="flex items-center gap-3">
                    <ProfilePhoto name={user.name} avatarUrl={user.avatar_url} />
                    <div className="space-x-2">
                        {user.name && <div>Name: <span className="text-muted-foreground">{user.name}</span></div>}
                        {user.surname && <div>Surname: <span className="text-muted-foreground">{user.surname}</span></div>}
                        <div>Username: <span className="text-muted-foreground">{user.username}</span></div>
                        <div>Email: <span className="text-muted-foreground">{user.email}</span></div>
                    </div>
                </div>

        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            width: '100px',
            render: (user: AdminUser) => <div>
                <Badge className={getStatusColor(user.status)}>
                    {user.status}
                </Badge>
            </div>
        },
        {
            key: 'activity',
            label: "Activity",
            sortable: true,
            width: '180px',
            render: (user: AdminUser) =>
                <div>
                    <div className="text-sm text-foreground">
                        {user.total_activities || 0} activities
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {user.streak_days || 0} day{user.streak_days && user.streak_days > 0 && "s"} streak
                    </div>
                </div>
        },
        {
            key: 'last_active',
            label: "Last Active",
            sortable: true,
            width: '200px',
            render: (user: AdminUser) =>
                <div className="flex flex-col">
                    <div>{getDaysAgo(formatSupabaseDate(user.last_sign_in_at))}</div>
                    <small className="text-muted-foreground">{formatSupabaseDate(user.last_sign_in_at)}</small>
                </div>
        },
        {
            key: 'stats',
            label: "Stats",
            sortable: true,
            width: '100px',
            render: (user: AdminUser) =>
                <div className="grid space-y-1 text-sm">
                    {user.habits_count !== undefined && (
                        <span className="text-habits">
                            H-{user.habits_count || 0}
                        </span>
                    )}
                    {user.goals_count !== undefined && (
                        <span className="text-goals">
                            G-{user.goals_count || 0}
                        </span>
                    )}
                    {user.friends_count !== undefined && (
                        <span className="text-friends">
                            F-{user.friends_count || 0}
                        </span>
                    )}
                </div>
        },
        {
            key: 'actions',
            label: "Actions",
            sortable: true,
            width: '100px',
            render: (user: AdminUser) =>
                <div className="flex flex-wrap">
                    <Button
                        variant="ghost"
                        onClick={() => showUserDetails(user)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => showUserLogs(user)}
                    >
                        <Activity className="w-4 h-4" />
                    </Button>
                </div>
        }

    ]
    return (
        <div>
            <Table>
                <TableHeader className="bg-card">
                    <TableRow className="bg-muted text-foreground">
                        {columns.map((col) =>
                            <TableHead key={col.key} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                {col.label}
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users && users.length > 0 ? (
                        users.map((row, index) => (
                            <TableRow
                                key={row.id || index}
                                className="hover:bg-muted/50 transition-colors border-b border-border"
                            >
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        className="px-6 py-4"
                                    >
                                        {col.render(row)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center py-8 text-muted-foreground"
                            >
                                No users found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )


};
