import {
  createDevotedPhotoUploadUrl,
  uploadDevotedPhotoBlobToSignedUrl,
} from "../../../api/services/partyDevotedPhotoService";
import { PERSONALIZED_PHOTO_EXPORT_MIME } from "./personalizeExport";

export type UploadDevotedPhotoResult = {
  path: string;
  publicUrl: string;
  storageEnv: string;
};

export async function uploadDevotedPhoto(params: {
  eventToken: string;
  blob: Blob;
  fileName?: string;
}): Promise<UploadDevotedPhotoResult> {
  const mime = params.blob.type || PERSONALIZED_PHOTO_EXPORT_MIME;
  const storageEnv = resolveDevotedStorageEnv();
  const fileName = params.fileName || "photo_dedicated.jpg";

  const uploadInfo = await createDevotedPhotoUploadUrl({
    eventToken: params.eventToken,
    payload: {
      fileName,
      mime,
      storageEnv,
    },
  });

  await uploadDevotedPhotoBlobToSignedUrl({
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

function resolveDevotedStorageEnv(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_ENV?.trim().toLowerCase();

  if (raw === "local" || raw === "prod") {
    return raw;
  }

  return process.env.NODE_ENV === "production" ? "prod" : "local";
}
