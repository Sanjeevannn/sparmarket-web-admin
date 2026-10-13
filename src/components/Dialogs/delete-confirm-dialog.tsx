"use client";

import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = "Confirm User Deletion",
  message = "Deleting this User will permanently remove all associated details. Do you want to continue?",
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="z-[70] max-w-md rounded-3xl border border-red-400 p-8 shadow-xl sm:max-w-md"
      >
        <DialogHeader className="items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-red-50">
            <Trash2 className="size-6 text-red-500" strokeWidth={2} />
          </span>
          <DialogTitle className="text-center text-xl font-semibold text-red-500">
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
            className="h-11 rounded-full bg-[#e8e8e8] text-foreground hover:bg-[#dcdcdc]"
            onClick={() => onOpenChange(false)}
          >
            No
          </Button>
          <Button
            type="button"
            className="h-11 rounded-full bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
