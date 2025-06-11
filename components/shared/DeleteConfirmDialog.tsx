import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type DeleteConfirmDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
};

export const DeleteConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
}: DeleteConfirmDialogProps) => {
    const t = useTranslations()
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title || t("forms.delete.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground mb-4">{description || t("forms.delete.description")}</p>
                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                        {t("buttons.cancel")}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        {t("buttons.yes-delete")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};