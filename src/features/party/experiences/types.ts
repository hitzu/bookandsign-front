import { ComponentType } from "react";
import { GallerySessionItem, SessionEventData, SessionPhoto } from "../../../interfaces/eventGallery";
import { SessionItem } from "../types/session";
import { GallerySource } from "../utils/sourceTracking";
import { EventPageTheme } from "../types/eventPageTheme";

export interface SplashProps {
  honoreesNames?: string;
  date?: string;
  isReady?: boolean;
  stepLabel?: string;
  onComplete: () => void;
  duration?: number;
  /** Gate before starting the completion timer — splash waits while this is false. */
  canFinish?: boolean;
  theme?: EventPageTheme;
}

export interface CarouselProps {
  photos: SessionPhoto[];
  items?: SessionItem[];
  eventData: SessionEventData;
  eventToken?: string;
  sessionToken?: string;
  source?: GallerySource;
  theme?: EventPageTheme;
}

export interface OverviewProps {
  eventToken: string;
  sessions: GallerySessionItem[];
  eventData: SessionEventData | null;
  source: GallerySource;
  onSelectSession: (token: string) => void;
  onShare: () => void | Promise<void>;
  onViewAllPhotos?: () => void | Promise<void>;
  isViewAllPhotosLoading?: boolean;
  theme?: EventPageTheme;
}

export interface ExperienceConfig {
  Splash: ComponentType<SplashProps>;
  Carousel: ComponentType<CarouselProps>;
  Overview: ComponentType<OverviewProps>;
  theme: EventPageTheme;
  pageBackground: string;
}
