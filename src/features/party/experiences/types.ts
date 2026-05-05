import { ComponentType } from "react";
import { GallerySessionItem, SessionEventData, SessionPhoto } from "../../../interfaces/eventGallery";
import { SessionItem } from "../types/session";
import { GallerySource } from "../utils/sourceTracking";

export interface SplashProps {
  honoreesNames?: string;
  date?: string;
  isReady?: boolean;
  stepLabel?: string;
  onComplete: () => void;
  duration?: number;
}

export interface CarouselProps {
  photos: SessionPhoto[];
  items?: SessionItem[];
  eventData: SessionEventData;
  eventToken?: string;
  sessionToken?: string;
  source?: GallerySource;
}

export interface OverviewProps {
  eventToken: string;
  sessions: GallerySessionItem[];
  eventData: SessionEventData | null;
  source: GallerySource;
  onSelectSession: (token: string) => void;
  onShare: () => void | Promise<void>;
}

export interface ExperienceConfig {
  Splash: ComponentType<SplashProps>;
  Carousel: ComponentType<CarouselProps>;
  Overview: ComponentType<OverviewProps>;
}
