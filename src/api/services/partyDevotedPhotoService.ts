import {
  PublicPersonalizedPhotoUploadUrlPayload,
  PublicPersonalizedPhotoUploadUrlResponse,
} from "../../interfaces";
import { axiosInstanceWithoutToken } from "../config/axiosConfig";

export const createDevotedPhotoUploadUrl = async (params: {
  eventToken: string;
  payload: PublicPersonalizedPhotoUploadUrlPayload;
}): Promise<PublicPersonalizedPhotoUploadUrlResponse> => {
  const normalizedToken = encodeURIComponent(params.eventToken);
  const response =
    await axiosInstanceWithoutToken.post<PublicPersonalizedPhotoUploadUrlResponse>(
      `/photos/event/${normalizedToken}/devoted/upload-url`,
      params.payload,
    );
  return response.data;
};

export const uploadDevotedPhotoBlobToSignedUrl = async (params: {
  signedUrl: string;
  blob: Blob;
  mime: string;
}): Promise<void> => {
  const res = await fetch(params.signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": params.mime || "application/octet-stream",
    },
    body: params.blob,
  });

  if (!res.ok) {
    throw new Error(`Devoted upload failed with status ${res.status}`);
  }
};
