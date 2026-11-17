import { apiRequest } from "@/lib/api/client";

interface MediaUploadResponse {
  success: boolean;
  media: {
    id: string;
    key: string;
    url?: string | null;
  };
}

interface MediaUrlResponse {
  success: boolean;
  url: string;
}

export async function uploadMedia(
  file: File | Blob,
  folder: "product-images" | "offer-images",
  filename = "upload.png"
) {
  const formData = new FormData();
  formData.append("file", file, filename);
  formData.append("folder", folder);

  return apiRequest<MediaUploadResponse>("/api/media/upload", {
    method: "POST",
    formData,
  });
}

export async function uploadDataUrl(
  dataUrl: string,
  folder: "product-images" | "offer-images"
) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const ext = blob.type.split("/")[1] || "png";
  return uploadMedia(blob, folder, `image.${ext}`);
}

export async function getMediaUrl(mediaId: string) {
  const data = await apiRequest<MediaUrlResponse>(
    `/api/media/${mediaId}/url`,
    { auth: false }
  );
  return data.url;
}

export function extractMediaId(media: unknown): string | null {
  if (!media) return null;
  if (typeof media === "string") return media;
  if (typeof media === "object") {
    const obj = media as { _id?: string; id?: string };
    return obj.id || obj._id || null;
  }
  return null;
}
