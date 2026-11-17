import { apiRequest } from "@/lib/api/client";
import { mapApiOffer } from "@/lib/api/mappers";
import { uploadDataUrl } from "@/lib/api/media";
import type {
  ComboOfferFormResult,
  OfferItem,
  SingleOfferFormResult,
} from "@/types/offer";

interface OffersResponse {
  success: boolean;
  offers: Record<string, unknown>[];
}

interface OfferResponse {
  success: boolean;
  offer: Record<string, unknown>;
  message?: string;
}

export async function fetchOffers(): Promise<OfferItem[]> {
  const data = await apiRequest<OffersResponse>("/api/admin/offers/");
  return Promise.all((data.offers || []).map((o) => mapApiOffer(o)));
}

async function resolveOfferImageId(image: string, imageId?: string) {
  if (imageId) return imageId;
  if (image.startsWith("data:")) {
    const uploaded = await uploadDataUrl(image, "offer-images");
    return uploaded.media.id;
  }
  if (/^[a-f\d]{24}$/i.test(image)) return image;
  throw new Error(
    "Offer image is required. Select a product that already has an uploaded image."
  );
}

export async function createSingleOfferApi(
  result: SingleOfferFormResult,
  imageId?: string
) {
  const mediaId = await resolveOfferImageId(result.line.image, imageId);
  const data = await apiRequest<OfferResponse>("/api/admin/offers/", {
    method: "POST",
    body: {
      name: result.line.title,
      description: result.line.description || result.line.title,
      image: mediaId,
      type: "SINGLE",
      startDate: result.validityFrom,
      endDate: result.validityTo,
      items: [
        {
          product: result.line.productId,
          variant: null,
          price: result.line.price,
        },
      ],
    },
  });
  return mapApiOffer(data.offer);
}

export async function createComboOfferApi(
  result: ComboOfferFormResult,
  imageId?: string
) {
  const mediaId = await resolveOfferImageId(result.image, imageId);
  const data = await apiRequest<OfferResponse>("/api/admin/offers/", {
    method: "POST",
    body: {
      name: result.title,
      description: result.description || result.title,
      image: mediaId,
      type: "COMBO",
      startDate: result.validityFrom,
      endDate: result.validityTo,
      items: result.products.map((p) => ({
        product: p.productId,
        variant: null,
        price: p.offerPrice,
      })),
    },
  });
  return mapApiOffer(data.offer);
}

export async function deleteOfferApi(offerId: string) {
  await apiRequest(`/api/admin/offers/${offerId}`, { method: "DELETE" });
}

export async function updateOfferStatusApi(offerId: string, isActive: boolean) {
  await apiRequest(`/api/admin/offers/${offerId}`, {
    method: "PUT",
    body: { isActive },
  });
}
