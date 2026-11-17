"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TaxonomyKind = "brand" | "category" | "subCategory";

export type TaxonomyFormValues = {
  name: string;
  parentCategoryId?: string;
};

type ParentOption = {
  id: string;
  name: string;
};

interface TaxonomyFormModelProps {
  open: boolean;
  mode: "add" | "edit";
  kind: TaxonomyKind;
  initialName?: string;
  initialParentId?: string;
  parentOptions?: ParentOption[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaxonomyFormValues) => void | Promise<void>;
}

function titleFor(kind: TaxonomyKind, mode: "add" | "edit") {
  const label =
    kind === "brand"
      ? "Brand"
      : kind === "category"
        ? "Category"
        : "Sub Category";
  return mode === "add" ? `Add ${label}` : `Edit ${label}`;
}

export function TaxonomyFormModel({
  open,
  mode,
  kind,
  initialName = "",
  initialParentId = "",
  parentOptions = [],
  onOpenChange,
  onSubmit,
}: TaxonomyFormModelProps) {
  const [name, setName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setParentCategoryId(initialParentId);
    setError("");
    setSaving(false);
  }, [open, initialName, initialParentId, kind, mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }
    if (kind === "subCategory" && !parentCategoryId) {
      setError("Parent category is required for subcategory.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSubmit({
        name: trimmed,
        parentCategoryId:
          kind === "subCategory" ? parentCategoryId : undefined,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md rounded-3xl border border-spar-green/30 p-0 sm:max-w-md"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
            <DialogTitle className="text-lg font-semibold text-foreground">
              {titleFor(kind, mode)}
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            {kind === "subCategory" ? (
              <div className="flex flex-col gap-1.5">
                <Label>Parent Category</Label>
                <Select
                  value={parentCategoryId || null}
                  onValueChange={(v) => setParentCategoryId(v ?? "")}
                >
                  <SelectTrigger className="h-10 rounded-xl border-0 bg-[#f3f4f6]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  kind === "brand"
                    ? "e.g. Ambewela"
                    : kind === "category"
                      ? "e.g. Dairy"
                      : "e.g. Milk"
                }
                className="h-10 rounded-xl border-0 bg-[#f3f4f6]"
              />
            </div>

            {error ? <p className="text-sm text-spar-red">{error}</p> : null}
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              className="h-10 rounded-xl bg-[#e8e8e8]"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-10 rounded-xl bg-spar-green text-white hover:bg-spar-green-dark"
            >
              {saving
                ? "Saving..."
                : mode === "add"
                  ? "Save"
                  : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
