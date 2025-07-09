import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogOverlay } from '@radix-ui/react-dialog'
import React from 'react'
import { DialogFooter, DialogHeader } from '../ui/dialog'
import { Button } from '../ui/button'

const ConfirmModal = (
    {
        isOpen,
        setIsOpen,
        title,
        subtitle,
        action,
        actionButton,
        cancelButton

    }: {
        isOpen: boolean,
        setIsOpen: (show: boolean) => void;
        title: string,
        subtitle: string,
        action: () => void,
        actionButton: string,
        cancelButton: string
    }

) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border-border border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-foreground">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-2">
                        {subtitle}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                    >
                        {cancelButton}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={action}
                    >
                        {actionButton}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmModal