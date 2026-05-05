import React from "react";
import styles from "@assets/css/fotobooth.module.css";
import {
  EffectName,
  ExportVariant,
  SessionItem,
} from "../../../../types/session";
import { SessionEventData } from "../../../../../../interfaces/eventGallery";
import EffectOverlay from "./EffectOverlay";

type AssetPickerSheetProps = {
  activeEffect: EffectName;
  activeItem: SessionItem | null;
  eventData: SessionEventData;
  isGenerating: boolean;
  isOpen: boolean;
  note: string | null;
  onClose: () => void;
  onSelectVariant: (variant: ExportVariant) => void | Promise<void>;
  supportsStaticExport: boolean;
};

const PreviewSurface = ({
  activeEffect,
  eventData,
  item,
  variant,
}: {
  activeEffect: EffectName;
  eventData: SessionEventData;
  item: SessionItem;
  variant: ExportVariant;
}) => {
  const content = (
    <div className={styles.exportPreviewMedia}>
      <img src={item.src} alt={item.alt} className={styles.exportPreviewImage} />
      <EffectOverlay effect={activeEffect} />
    </div>
  );

  if (variant === "polaroid") {
    return (
      <div className={styles.exportPreviewPolaroid}>
        {content}
        <div className={styles.exportPreviewFooter}>
          <div className={styles.exportPreviewEventName}>
            {eventData.honoreesNames}
          </div>
        </div>
      </div>
    );
  }

  return <div className={styles.exportPreviewOriginal}>{content}</div>;
};

const AssetPickerSheet = ({
  activeEffect,
  activeItem,
  eventData,
  isGenerating,
  isOpen,
  note,
  onClose,
  onSelectVariant,
  supportsStaticExport,
}: AssetPickerSheetProps) => {
  if (!isOpen || !activeItem) return null;

  return (
    <div
      className={styles.exportSheetOverlay}
      onClick={(event) => {
        if (event.target === event.currentTarget && !isGenerating) onClose();
      }}
    >
      <div className={styles.exportSheet}>
        <div className={styles.exportSheetHandle} />
        <div className={styles.exportSheetHeader}>
          <div>
            <div className={styles.exportSheetEyebrow}>
              {supportsStaticExport ? "Elige formato" : "Exportacion en progreso"}
            </div>
            <h3 className={styles.exportSheetTitle}>¿Cómo la quieres?</h3>
          </div>
          <button
            type="button"
            className={styles.exportSheetClose}
            onClick={onClose}
            aria-label="Cerrar selector"
            disabled={isGenerating}
          >
            ✕
          </button>
        </div>

        {note && <p className={styles.exportSheetNote}>{note}</p>}

        <div className={styles.exportOptionsGrid}>
          {(["original", "polaroid"] as ExportVariant[]).map((variant) => {
            const label = variant === "original" ? "Original" : "Polaroid";

            return (
              <button
                key={variant}
                type="button"
                className={styles.exportOptionCard}
                onClick={() => onSelectVariant(variant)}
                disabled={!supportsStaticExport || isGenerating}
              >
                <PreviewSurface
                  activeEffect={activeEffect}
                  eventData={eventData}
                  item={activeItem}
                  variant={variant}
                />
                <div className={styles.exportOptionLabel}>{label}</div>
                {isGenerating && (
                  <div className={styles.exportOptionBusy}>Generando...</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssetPickerSheet;
