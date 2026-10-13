"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { AppUser, UserFormValues } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/Dialogs/confirm-dialog";

const EMPTY_FORM: UserFormValues = {
  manager: "",
  username: "",
  password: "",
  confirmPassword: "",
};

interface UserFormModelProps {
  open: boolean;
  mode: "add" | "edit";
  user?: AppUser | null;
  onOpenChange: (open: boolean) => void;
  onSave: (values: UserFormValues, userId?: string) => void;
}

export function UserFormModel({
  open,
  mode,
  user,
  onOpenChange,
  onSave,
}: UserFormModelProps) {
  const [form, setForm] = useState<UserFormValues>(EMPTY_FORM);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && user) {
      setForm({
        manager: user.manager,
        username: user.username,
        password: "",
        confirmPassword: "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError("");
    setConfirmOpen(false);
  }, [open, mode, user]);

  function updateField<K extends keyof UserFormValues>(
    key: K,
    value: UserFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveClick(e: React.FormEvent) {
    e.preventDefault();
    if (!form.manager.trim() || !form.username.trim()) {
      setError("Manager and username are required.");
      return;
    }
    if (mode === "add" || form.password || form.confirmPassword) {
      if (!form.password) {
        setError("Password is required.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }
    setError("");
    setConfirmOpen(true);
  }

  const fieldClass =
    "h-11 rounded-xl border-0 bg-[#f3f4f6] shadow-none focus-visible:ring-spar-green/30";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="max-w-md rounded-3xl p-6 sm:max-w-md"
        >
          <DialogHeader className="mb-2 flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-xl font-semibold">
              {mode === "add" ? "Create Users" : "Edit User"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-8 items-center justify-center rounded-full text-spar-green transition hover:bg-[#e8f5ee]"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={2.5} />
            </button>
          </DialogHeader>

          <form onSubmit={handleSaveClick} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Branch Manager</Label>
              <Input
                value={form.manager}
                onChange={(e) => updateField("manager", e.target.value)}
                placeholder="eg; John Doe"
                className={fieldClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>User name</Label>
              <Input
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
                placeholder="eg; Admin1"
                className={fieldClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="••••••••"
                className={fieldClass}
                required={mode === "add"}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  updateField("confirmPassword", e.target.value)
                }
                placeholder="••••••••"
                className={fieldClass}
                required={mode === "add"}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="mt-2 h-12 w-full rounded-2xl bg-spar-green text-base font-semibold text-white hover:bg-spar-green-dark"
            >
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Save Action"
        message="Please confirm if you want to save the User ."
        onConfirm={() => {
          onSave(form, mode === "edit" ? user?.id : undefined);
          onOpenChange(false);
        }}
      />
    </>
  );
}
