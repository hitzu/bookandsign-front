import React, { useState } from "react";
import styles from "@assets/css/fotobooth.module.css";
import { CarouselProps } from "../../types";
import { useFotoBoothCarousel } from "./hooks/useFotoBoothCarousel";
import { useFotoBoothCarouselEffects } from "./hooks/useFotoBoothCarouselEffects";
import ActionBar from "./ui/ActionBar";
import BenefitBanner from "./ui/BenefitBanner";
import CarouselHeader from "./ui/CarouselHeader";
import GiftModal from "./ui/GiftModal";
import ItemStage from "./ui/ItemStage";
import SessionInlineCta from "./ui/SessionInlineCta";
import ShareFallbackModal from "./ui/ShareFallbackModal";
import SuccessCtaModal from "./ui/SuccessCtaModal";
import { buildThemeVars } from "../../../utils/themeVars";

const FotoBoothCarousel = (props: CarouselProps) => {
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const {
    activeEffect,
    activeItem,
    activeItemState,
    canNavigate,
    canOpenGallery,
    closeShareFallback,
    closeSuccessCta,
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
    handleSessionSocialClick,
    handleSessionWhatsAppClick,
    handleShare,
    index,
    isGeneratingAsset,
    isShareFallbackOpen,
    isSuccessCtaOpen,
    items,
    shareFallbackPreviewUrl,
    successCtaSource,
  } = useFotoBoothCarousel(props);

  useFotoBoothCarouselEffects({
    activeItem,
    activeItemStatus: activeItemState.status,
    eventToken: props.eventToken ?? props.eventData.eventToken,
    index,
    items,
    photos: props.photos,
    source: props.source,
    shareFallbackPreviewUrl,
    sessionToken: props.sessionToken,
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

      <BenefitBanner
        titulo="Beneficio especial"
        subtitulo="Comparte y gana un regalo"
        onPress={() => {
          handleOpenRewardPromo();
          setIsGiftModalOpen(true);
        }}
      />

      <SessionInlineCta
        eventName={props.eventData.honoreesNames}
        onWAClick={handleSessionWhatsAppClick}
        onSocialClick={handleSessionSocialClick}
      />

      <SuccessCtaModal
        eventName={props.eventData.honoreesNames}
        isOpen={isSuccessCtaOpen}
        onClose={closeSuccessCta}
        source={successCtaSource}
      />

      <GiftModal
        visible={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        onShare={() => {
          setIsGiftModalOpen(false);
          void handleShare();
        }}
        theme={props.theme}
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
