import React from "react";
import styles from "@assets/css/fotobooth.module.css";
import { CarouselProps } from "../../types";
import { useFotoBoothCarousel } from "./hooks/useFotoBoothCarousel";
import { useFotoBoothCarouselEffects } from "./hooks/useFotoBoothCarouselEffects";
import ActionBar from "./ui/ActionBar";
import AssetPickerSheet from "./ui/AssetPickerSheet";
import CarouselHeader from "./ui/CarouselHeader";
import ItemStage from "./ui/ItemStage";
import SessionInlineCta from "./ui/SessionInlineCta";
import ShareFallbackModal from "./ui/ShareFallbackModal";
import SuccessCtaModal from "./ui/SuccessCtaModal";

const FotoBoothCarousel = (props: CarouselProps) => {
  const {
    activeEffect,
    activeItem,
    activeItemState,
    canNavigate,
    canOpenGallery,
    closePicker,
    closeShareFallback,
    closeSuccessCta,
    gifHintVisible,
    goTo,
    handleCopySessionLink,
    handleFallbackDownload,
    handleItemError,
    handleItemLoad,
    handleOpenGallery,
    handlePointerEnd,
    handlePointerStart,
    handleRetry,
    handleSave,
    handleShare,
    handleVariantSelect,
    index,
    isGeneratingAsset,
    isPickerOpen,
    isShareFallbackOpen,
    isSuccessCtaOpen,
    items,
    pickerNote,
    setGifHintVisible,
    shareFallbackPreviewUrl,
    supportsExport,
  } = useFotoBoothCarousel(props);

  useFotoBoothCarouselEffects({
    activeItem,
    activeItemStatus: activeItemState.status,
    eventToken: props.eventToken,
    index,
    items,
    photos: props.photos,
    shareFallbackPreviewUrl,
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
        onSave={handleSave}
        onShare={handleShare}
      />

      <SessionInlineCta eventName={props.eventData.honoreesNames} />

      <AssetPickerSheet
        activeEffect={activeEffect}
        activeItem={activeItem}
        eventData={props.eventData}
        isGenerating={isGeneratingAsset}
        isOpen={isPickerOpen}
        note={pickerNote}
        onClose={closePicker}
        onSelectVariant={handleVariantSelect}
        supportsStaticExport={supportsExport}
      />

      <SuccessCtaModal
        eventName={props.eventData.honoreesNames}
        isOpen={isSuccessCtaOpen}
        onClose={closeSuccessCta}
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
