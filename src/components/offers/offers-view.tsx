"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  User,
} from "lucide-react";
import type {
  OfferItem,
  OfferKind,
  SingleOfferFormResult,
  ComboOfferFormResult,
} from "@/types/offer";
import { OFFER_CATEGORIES } from "@/lib/data/offers";
import { OfferCard } from "@/components/offers/offer-card";
import { SingleOfferFormModel } from "@/components/Models/single-offer-form-model";
import { ComboOfferFormModel } from "@/components/Models/combo-offer-form-model";
import { OfferDetailsModel } from "@/components/Models/offer-details-model";
import { DeleteConfirmDialog } from "@/components/Dialogs/delete-confirm-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "cn";
import {
  createComboOfferApi,
  createSingleOfferApi,
  deleteOfferApi,
  fetchOffers,
  updateOfferStatusApi,
} from "@/lib/api/offers";
import { fetchProducts } from "@/lib/api/products";
import type { Product } from "@/types/product";
import { ApiError } from "@/lib/api/client";

const PAGE_SIZE = 10;

export function OffersView() {
  const [tab, setTab] = useState<OfferKind>("single");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [singleOffers, setSingleOffers] = useState<OfferItem[]>([]);
  const [comboOffers, setComboOffers] = useState<OfferItem[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<OfferItem | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [comboFormOpen, setComboFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferItem | null>(null);

  async function loadOffers() {
    setLoading(true);
    setError("");
    try {
      const [list, products] = await Promise.all([
        fetchOffers(),
        fetchProducts(),
      ]);
      setSingleOffers(list.filter((o) => o.kind === "single"));
      setComboOffers(list.filter((o) => o.kind === "combo"));
      setCatalogProducts(products);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load offers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOffers();
  }, []);

  const source = tab === "single" ? singleOffers : comboOffers;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return source.filter((o) => {
      if (q) {
        const hay =
          `${o.title} ${o.brand ?? ""} ${o.description ?? ""} ${o.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (category && category !== "all") {
        if (o.category.toLowerCase() !== category) return false;
      }
      return true;
    });
  }, [source, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const showingFrom = filtered.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PAGE_SIZE, filtered.length);

  function changeTab(next: OfferKind) {
    setTab(next);
    setPage(1);
  }

  function openDetails(offer: OfferItem) {
    setSelectedOffer(offer);
    setDetailsOpen(true);
  }

  function handleAddOffer() {
    if (tab === "single") {
      setFormOpen(true);
      return;
    }
    setComboFormOpen(true);
  }

  async function handleSaveSingleOffer(result: SingleOfferFormResult) {
    const created = await createSingleOfferApi(
      result,
      result.line.imageId || undefined
    );
    setSingleOffers((prev) => [created, ...prev]);
    setPage(1);
  }

  async function handleSaveComboOffer(result: ComboOfferFormResult) {
    const created = await createComboOfferApi(result);
    setComboOffers((prev) => [created, ...prev]);
    setPage(1);
  }

  async function handleStatusChange(offerId: string, active: boolean) {
    const status = active ? "active" : "inactive";
    try {
      await updateOfferStatusApi(offerId, active);
      setSingleOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status } : o))
      );
      setComboOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status } : o))
      );
      setSelectedOffer((prev) =>
        prev && prev.id === offerId ? { ...prev, status } : prev
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to update offer status"
      );
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteOfferApi(deleteTarget.id);
      if (deleteTarget.kind === "single") {
        setSingleOffers((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      } else {
        setComboOffers((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      }
      if (selectedOffer?.id === deleteTarget.id) {
        setDetailsOpen(false);
        setSelectedOffer(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete offer");
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-4 rounded-full bg-[#eceef2] px-5 py-2.5">
          <h1 className="min-w-0 shrink text-lg font-semibold tracking-tight text-foreground">
            Offer management
          </h1>

          <div className="relative mx-auto w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-full border-0 bg-white pl-9 shadow-none focus-visible:ring-spar-green/20"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/70 hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-5" strokeWidth={1.75} />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-spar-red" />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="flex size-8 items-center justify-center rounded-full bg-white text-muted-foreground">
                <User className="size-4" strokeWidth={1.75} />
              </span>
              Admin
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-full bg-[#eceef2] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeTab("single")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                tab === "single"
                  ? "bg-[#d8efe3] text-[#49AE20]"
                  : "bg-white text-muted-foreground hover:text-foreground"
              )}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => changeTab("combo")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                tab === "combo"
                  ? "bg-[#d8efe3] text-[#49AE20]"
                  : "bg-white text-muted-foreground hover:text-foreground"
              )}
            >
              Combo
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={category || null}
              onValueChange={(v) => {
                setCategory(v ?? "");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 min-w-[130px] gap-2 rounded-full border-0 bg-white shadow-none">
                <Filter className="size-3.5 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Category</SelectItem>
                {OFFER_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c.toLowerCase()}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              className="h-9 rounded-full bg-spar-green px-5 text-white hover:bg-spar-green-dark"
              onClick={handleAddOffer}
            >
              Add Offer
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {error && <p className="mb-2 text-sm text-spar-red">{error}</p>}
        {loading && (
          <p className="mb-2 text-sm text-muted-foreground">Loading offers...</p>
        )}
        <div
          className={cn(
            "grid gap-3",
            tab === "single"
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {pageItems.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onClick={openDetails}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-3 rounded-2xl bg-[#eceef2] p-10 text-center text-sm text-muted-foreground">
            No offers match your filters.
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-full bg-[#eceef2] px-5 py-2.5">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {String(showingFrom).padStart(2, "0")}-
            {String(showingTo).padStart(2, "0")}
          </span>{" "}
          of {filtered.length} {tab === "single" ? "Products" : "Offer"}
        </p>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(
            (n) => (
              <Button
                key={n}
                type="button"
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "size-8 rounded-full",
                  n === currentPage &&
                    "bg-[#d8efe3] text-[#49AE20] hover:bg-[#c5e6d4] hover:text-[#49AE20]"
                )}
                onClick={() => setPage(n)}
              >
                {n}
              </Button>
            )
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <SingleOfferFormModel
        open={formOpen}
        products={catalogProducts}
        onOpenChange={setFormOpen}
        onSave={handleSaveSingleOffer}
      />

      <ComboOfferFormModel
        open={comboFormOpen}
        catalogProducts={catalogProducts}
        onOpenChange={setComboFormOpen}
        onSave={handleSaveComboOffer}
      />

      <OfferDetailsModel
        open={detailsOpen}
        offer={selectedOffer}
        onOpenChange={setDetailsOpen}
        onDelete={(offer) => {
          setDetailsOpen(false);
          setDeleteTarget(offer);
        }}
        onStatusChange={handleStatusChange}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Confirm Offer Deletion"
        message="Deleting this Offer will permanently remove all associated details. Do you want to continue?"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
