"use client";

import React from 'react';
import { formatSupabaseDate } from '@/lib/utils/date/formatDate';
import { useUserLogs } from '@/lib/Queries/admin/usersManagment/useUserLogs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from '@/components/ui/dialog';

interface Props {
  user: AdminUser;
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
}

const ActivityLogsModal: React.FC<Props> = ({ user, showLogs, setShowLogs }) => {
  const { data: userLogs = [] } = useUserLogs();

  return (
    <Dialog open={showLogs} onOpenChange={setShowLogs}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
      <DialogContent className="bg-card border-border rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between mb-6">
          <DialogTitle className="text-xl font-bold text-foreground">
            Activity Logs - {user.username}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            View the selected user's activity logs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {userLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No activity logs found for this user.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userLogs.map((log: ActivityLog) => (
                <div
                  key={log.id}
                  className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">
                      {log.action}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatSupabaseDate(log.timestamp)}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">IP:</span> {log.ip_address}
                  </div>

                  {log.details && (
                    <div className="text-sm mt-1 text-muted-foreground">
                      <span className="font-medium">Details:</span> {log.details}
                    </div>
                  )}

                  {log.user_agent && (
                    <div className="text-xs mt-1 text-muted-foreground truncate">
                      <span className="font-medium">User Agent:</span> {log.user_agent}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityLogsModal;