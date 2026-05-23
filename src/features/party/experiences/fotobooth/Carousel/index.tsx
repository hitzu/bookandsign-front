import React, { useState } from "react";
import styles from "@assets/css/fotobooth.module.css";
import { CarouselProps } from "../../types";
import { useFotoBoothCarousel } from "./hooks/useFotoBoothCarousel";
import { useFotoBoothCarouselEffects } from "./hooks/useFotoBoothCarouselEffects";
import ActionBar from "./ui/ActionBar";
import CarouselHeader from "./ui/CarouselHeader";
import ItemStage from "./ui/ItemStage";
import { rewardPromoCopy } from "./rewardPromoCopy";
import RewardPromoBadge from "./ui/RewardPromoBadge";
import RewardPromoModal from "./ui/RewardPromoModal";
import SessionInlineCta from "./ui/SessionInlineCta";
import ShareFallbackModal from "./ui/ShareFallbackModal";
import SuccessCtaModal from "./ui/SuccessCtaModal";
import { buildThemeVars } from "../../../utils/themeVars";

const FotoBoothCarousel = (props: CarouselProps) => {
  const [isRewardPromoOpen, setIsRewardPromoOpen] = useState(false);
  const {
    activeEffect,
    activeItem,
    activeItemState,
    canNavigate,
    canOpenGallery,
    closeShareFallback,
    closeSuccessCta,
    gifHintVisible,
    goTo,
    handleCopySessionLink,
    handleFallbackDownload,
    handleItemError,
    handleItemLoad,
    handleOpenGallery,
    handleOpenRewardPromo,
    handlePointerEnd,
    handlePointerStart,
    handleRetry,
    handleSave,
    handleShare,
    index,
    isGeneratingAsset,
    isShareFallbackOpen,
    isSuccessCtaOpen,
    items,
    setGifHintVisible,
    shareFallbackPreviewUrl,
    successCtaSource,
  } = useFotoBoothCarousel(props);

  useFotoBoothCarouselEffects({
    activeItem,
    activeItemStatus: activeItemState.status,
    eventToken: props.eventToken,
    index,
    items,
    photos: props.photos,
    source: props.source,
    shareFallbackPreviewUrl,
    sessionToken: props.sessionToken,
    setGifHintVisible,
  });

  return (
    <div
      className={styles.screen}
      style={props.theme ? buildThemeVars(props.theme) : undefined}
    >
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

      <div className={styles.rewardPromoSlot}>
        <RewardPromoBadge
          copy={rewardPromoCopy}
          onClick={() => {
            handleOpenRewardPromo();
            setIsRewardPromoOpen(true);
          }}
        />
      </div>

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
        source={successCtaSource}
      />

      <RewardPromoModal
        copy={rewardPromoCopy}
        isOpen={isRewardPromoOpen}
        onClose={() => setIsRewardPromoOpen(false)}
      />

      {isShareFallbackOpen && shareFallbackPreviewUrl && (
        <ShareFallbackModal
          onClose={closeShareFallback}
          onCopyLink={handleCopySessionLink}
          onDownload={handleFallbackDownload}
          previewUrl={shareFallbackPreviewUrl}
        />
      )}
    </div>
  );
};

export default FotoBoothCarousel;
