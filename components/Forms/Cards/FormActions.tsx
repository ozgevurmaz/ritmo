import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type FormActionsProps = {
  isSubmitting: boolean;
  submitLabel?: string;
  editLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  cancelHref?: string
  onDelete?: () => void;
  showDelete?: boolean;
  isEdit?: boolean;
};

export const FormActions = ({
  isSubmitting,
  submitLabel,
  cancelLabel,
  onCancel,
  cancelHref,
  isEdit,
  editLabel,
  onDelete,
  showDelete = false,
}: FormActionsProps) => {
  const t = useTranslations("buttons");
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) return onCancel();
    if (cancelHref) return router.push(cancelHref);
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t mt-6">
      {(showDelete && onDelete) && (
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          disabled={isSubmitting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {t("delete")}
        </Button>
      )}

      <div className="ml-auto flex gap-2">
        {(onCancel || cancelHref) && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {cancelLabel || t("cancel")}
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? editLabel : submitLabel}
        </Button>
      </div>
    </div>
  );
};
