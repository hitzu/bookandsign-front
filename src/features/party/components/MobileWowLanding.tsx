import React from "react";
import { EventPhoto } from "../../../interfaces";
import HeroCoverMobile from "./HeroCoverMobile";
import InfiniteLoader from "./InfiniteLoader";
import MasonryGridMobile from "./MasonryGridMobile";

type MobileWowLandingProps = {
  eventTitle: string;
  eventSubtitle: string;
  eventDescription?: string;
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
  eventTitle,
  eventSubtitle,
  eventDescription,
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
        title={eventTitle}
        subtitle={eventSubtitle}
        description={eventDescription}
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
