"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Confirm Save Action",
  message = "Please confirm if you want to save the Product.",
  confirmLabel = "Yes",
  cancelLabel = "No",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="z-[70] max-w-md rounded-3xl border border-spar-green/40 p-8 shadow-xl sm:max-w-md"
      >
        <DialogHeader className="items-center gap-3 text-center">
          <DialogTitle className="text-center text-xl font-semibold text-spar-green">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground">
            {message}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-11 rounded-xl bg-[#e8e8e8] text-foreground hover:bg-[#dcdcdc]"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className="h-11 rounded-xl bg-spar-green text-white hover:bg-spar-green-dark"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
