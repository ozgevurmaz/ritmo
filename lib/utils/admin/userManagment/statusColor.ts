export const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-success text-success-foreground';
        case 'banned':
            return 'bg-destructive text-destructive-foreground';
        case 'unconfirmed':
            return 'bg-warning text-warning-foreground';
        default:
            return 'bg-muted text-muted-foreground';
    }
};