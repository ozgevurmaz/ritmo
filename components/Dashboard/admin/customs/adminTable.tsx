import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfilePhoto from '@/components/shared/profilePhoto';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction<T = any> {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  condition?: (row: T) => boolean;
}

export interface AdminTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  emptyMessage?: string;
  className?: string;
}

const getActionVariantStyle = (variant: TableAction['variant']) => {
  switch (variant) {
    case 'destructive':
      return 'hover:text-destructive';
    case 'warning':
      return 'hover:text-warning';
    case 'success':
      return 'hover:text-success';
    default:
      return 'hover:text-primary';
  }
};

export function AdminTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  loading = false,
  onSort,
  sortColumn,
  sortDirection,
  emptyMessage = "No data available",
  className = "",
}: AdminTableProps<T>) {
  const handleSort = (column: string) => {
    if (!onSort) return;

    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column, newDirection);
  };

  if (loading) {
    return (
      <div className={`rounded-lg border ${className}`} style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-border)'
      }}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p style={{ color: 'var(--color-muted-foreground)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`rounded-lg border ${className}`} style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-border)'
      }}>
        <div className="p-8 text-center">
          <p style={{ color: 'var(--color-muted-foreground)' }}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Split actions into primary (first 3) and overflow
  const primaryActions = actions.slice(0, 3);
  const overflowActions = actions.slice(3);

  return (
    <div className={`rounded-lg border overflow-hidden ${className}`} style={{
      backgroundColor: 'var(--color-card)',
      borderColor: 'var(--color-border)'
    }}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: 'var(--color-muted)' }}>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-opacity-50' : ''
                    }`}
                  style={{
                    color: 'var(--color-muted-foreground)',
                    width: column.width
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-primary">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id || index}
                className="hover:bg-opacity-50 transition-colors"
                style={{ backgroundColor: 'var(--color-card)' }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className="px-6 py-4"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {primaryActions.map((action) => {
                        if (action.condition && !action.condition(row)) return null;

                        const IconComponent = action.icon;
                        return (
                          <Button
                            key={action.key}
                            variant="ghost"
                            size="sm"
                            onClick={() => action.onClick(row)}
                            disabled={action.disabled?.(row)}
                            className={`p-2 h-8 w-8 ${getActionVariantStyle(action.variant)}`}
                            title={action.label}
                          >
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                          </Button>
                        );
                      })}

                      {overflowActions.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 h-8 w-8"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {overflowActions.map((action) => {
                              if (action.condition && !action.condition(row)) return null;

                              const IconComponent = action.icon;
                              return (
                                <DropdownMenuItem
                                  key={action.key}
                                  onClick={() => action.onClick(row)}
                                  disabled={action.disabled?.(row)}
                                  className={getActionVariantStyle(action.variant)}
                                >
                                  {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                                  {action.label}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Helper components for common cell types
export const UserCell = ({ user }: { user: { name?: string; email: string; username?: string; avatar?: string } }) => (
  <div className="flex items-center space-x-3">
    <ProfilePhoto name={user.name || null} avatarUrl={user.avatar} />
    <div>
      <div className="text-sm font-medium text-muted-foreground">
        {user.name || 'Unknown User'}
      </div>
      <div className="text-sm text-muted-foreground">
        {user.email}
      </div>
      {user.username && (
        <div className="text-xs text-muted-foreground">
          @{user.username}
        </div>
      )}
    </div>
  </div>
);

export const StatusCell = ({ status, provider }: { status: string; provider?: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'banned':
        return 'bg-destructive text-destructive-foreground';
      case 'unconfirmed':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div>
      <Badge className={getStatusColor(status)}>
        {status}
      </Badge>
      {provider && (
        <div className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          {provider}
        </div>
      )}
    </div>
  );
};

export const StatsCell = ({ habits, goals, friends }: { habits?: number; goals?: number; friends?: number }) => (
  <div className="flex space-x-4 text-sm">
    {habits !== undefined && (
      <span style={{ color: 'var(--color-habits)' }}>
        {habits}H
      </span>
    )}
    {goals !== undefined && (
      <span style={{ color: 'var(--color-goals)' }}>
        {goals}G
      </span>
    )}
    {friends !== undefined && (
      <span style={{ color: 'var(--color-friends)' }}>
        {friends}F
      </span>
    )}
  </div>
);

export const DateCell = ({ date, showRelative = true }: { date: string; showRelative?: boolean }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysAgo = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div>
      <div className="text-sm" style={{ color: 'var(--color-foreground)' }}>
        {showRelative ? getDaysAgo(date) : formatDate(date)}
      </div>
      <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
        {formatDate(date)}
      </div>
    </div>
  );
};