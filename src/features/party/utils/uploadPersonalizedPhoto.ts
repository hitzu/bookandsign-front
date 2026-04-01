import {
  createPublicPersonalizedPhotoUploadUrl,
  uploadPersonalizedPhotoBlobToSignedUrl,
} from "../../../api/services/partyPersonalizedPhotoService";
import { PERSONALIZED_PHOTO_EXPORT_MIME } from "./personalizeExport";

export type UploadPersonalizedPhotoResult = {
  path: string;
  publicUrl: string;
  storageEnv: string;
};

export async function uploadPersonalizedPhoto(params: {
  eventToken: string;
  blob: Blob;
  fileName?: string;
}): Promise<UploadPersonalizedPhotoResult> {
  const mime = params.blob.type || PERSONALIZED_PHOTO_EXPORT_MIME;
  const storageEnv = resolvePersonalizedStorageEnv();
  const fileName = params.fileName || "photo_customized.jpg";

  const uploadInfo = await createPublicPersonalizedPhotoUploadUrl({
    eventToken: params.eventToken,
    payload: {
      fileName,
      mime,
      storageEnv,
    },
  });

  await uploadPersonalizedPhotoBlobToSignedUrl({
    signedUrl: uploadInfo.signedUrl,
    blob: params.blob,
    mime,
  });

  return {
    path: uploadInfo.path,
    publicUrl: uploadInfo.publicUrl,
    storageEnv,
  };
}

export function resolvePersonalizedStorageEnv(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_ENV?.trim().toLowerCase();

  if (raw === "local" || raw === "prod") {
    return raw;
  }

  return process.env.NODE_ENV === "production" ? "prod" : "local";
}
