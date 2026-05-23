import {
  EVENT_ACCESS_STATUS,
  GalleryStatus,
  SessionStatus,
} from "../../../interfaces/eventGallery";

export const isExpiredEventStatus = (
  status?: GalleryStatus | null,
): boolean =>
  status === EVENT_ACCESS_STATUS.FINISHED ||
  status === EVENT_ACCESS_STATUS.FINALIZED;

export const isExpiredSessionStatus = (
  status?: SessionStatus | null,
): boolean => status === EVENT_ACCESS_STATUS.FINISHED;
