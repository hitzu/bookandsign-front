import { ComponentType } from "react";
import { GallerySessionItem, SessionEventData, SessionPhoto } from "../../../interfaces/eventGallery";

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
  eventData: SessionEventData;
}

export interface OverviewProps {
  sessions: GallerySessionItem[];
  eventData: SessionEventData | null;
  onSelectSession: (token: string) => void;
  onShare: () => void | Promise<void>;
}

export interface ExperienceConfig {
  Splash: ComponentType<SplashProps>;
  Carousel: ComponentType<CarouselProps>;
  Overview: ComponentType<OverviewProps>;
}
