import React from "react";
import { EventPhoto } from "../../../interfaces";
import HeroCoverMobile from "./HeroCoverMobile";
import InfiniteLoader from "./InfiniteLoader";
import MasonryGridMobile from "./MasonryGridMobile";

type MobileWowLandingProps = {
  eventName?: string;
  eventDescription?: string;
  eventDateLabel?: string;
  heroCoverUrls: string[];
  items: EventPhoto[];
  parallaxOffset: number;
  onViewPhotos: () => void;
  onShareLink: () => void;
  onSelectPhoto: (index: number) => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreError: string | null;
  onLoadMore: () => void;
  onRetryLoadMore: () => void;
};

const MobileWowLanding = ({
  eventName,
  eventDescription,
  eventDateLabel,
  heroCoverUrls,
  items,
  parallaxOffset,
  onViewPhotos,
  onShareLink,
  onSelectPhoto,
  hasMore,
  isLoadingMore,
  loadMoreError,
  onLoadMore,
  onRetryLoadMore,
}: MobileWowLandingProps) => {
  return (
    <>
      <HeroCoverMobile
        eventName={eventName}
        eventDescription={eventDescription}
        eventDateLabel={eventDateLabel}
        coverUrls={heroCoverUrls}
        parallaxOffset={parallaxOffset}
        onViewPhotos={onViewPhotos}
        onShareLink={onShareLink}
      />
      <MasonryGridMobile items={items} onSelectPhoto={onSelectPhoto} />
      <InfiniteLoader
        hasMore={hasMore}
        isLoading={isLoadingMore}
        error={loadMoreError}
        onLoadMore={onLoadMore}
        onRetry={onRetryLoadMore}
      />
    </>
  );
};

export default MobileWowLanding;
