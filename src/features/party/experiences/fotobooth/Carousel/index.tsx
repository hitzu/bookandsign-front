import React from "react";
import styles from "@assets/css/fotobooth.module.css";
import { CarouselProps } from "../../types";
import { useFotoBoothCarousel } from "./hooks/useFotoBoothCarousel";
import { useFotoBoothCarouselEffects } from "./hooks/useFotoBoothCarouselEffects";
import ActionBar from "./ui/ActionBar";
import CarouselHeader from "./ui/CarouselHeader";
import ItemStage from "./ui/ItemStage";
import SessionInlineCta from "./ui/SessionInlineCta";
import SuccessCtaModal from "./ui/SuccessCtaModal";

const FotoBoothCarousel = (props: CarouselProps) => {
  const {
    activeEffect,
    activeItem,
    activeItemState,
    canNavigate,
    canOpenGallery,
    closeSuccessCta,
    gifHintVisible,
    goTo,
    handleItemError,
    handleItemLoad,
    handleOpenGallery,
    handlePointerEnd,
    handlePointerStart,
    handleRetry,
    handleSave,
    handleShare,
    index,
    isGeneratingAsset,
    isSuccessCtaOpen,
    items,
    setGifHintVisible,
  } = useFotoBoothCarousel(props);

  useFotoBoothCarouselEffects({
    activeItem,
    activeItemStatus: activeItemState.status,
    eventToken: props.eventToken,
    index,
    items,
    photos: props.photos,
    source: props.source,
    sessionToken: props.sessionToken,
    setGifHintVisible,
  });

  return (
    <div className={styles.screen}>
      <CarouselHeader
        canOpenGallery={canOpenGallery}
        currentIndex={index}
        onOpenGallery={handleOpenGallery}
        totalItems={items.length}
      />

      <ItemStage
        activeEffect={activeEffect}
        activeIndex={index}
        canNavigate={canNavigate}
        gifHintVisible={gifHintVisible}
        itemState={activeItemState}
        items={items}
        onGoTo={goTo}
        onItemError={handleItemError}
        onItemLoad={handleItemLoad}
        onPointerEnd={handlePointerEnd}
        onPointerStart={handlePointerStart}
        onRetry={handleRetry}
      />

      <ActionBar
        isBusy={isGeneratingAsset}
        onSave={handleSave}
        onShare={handleShare}
      />

      <SessionInlineCta eventName={props.eventData.honoreesNames} />

      <SuccessCtaModal
        eventName={props.eventData.honoreesNames}
        isOpen={isSuccessCtaOpen}
        onClose={closeSuccessCta}
      />
    </div>
  );
};

export default FotoBoothCarousel;
