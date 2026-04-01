"use client";

import React, { useEffect } from "react";
import { STICKER_IDS, getStickerUrl } from "../utils/personalizeStickers";
import styles from "@assets/css/party-public.module.css";

type BottomStickerTrayProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (url: string) => void;
};

const BottomStickerTray = ({
  isOpen,
  onClose,
  onSelectSticker,
}: BottomStickerTrayProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleSticker = (url: string) => {
    onSelectSticker(url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={styles.stickerTrayBackdrop}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
      <div className={styles.stickerTraySheet}>
        <div className={styles.stickerTrayHandle} />
        <div className={styles.stickerTrayContent}>
          <div className={styles.stickerPaletteVertical}>
            {STICKER_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={styles.stickerPaletteItemVertical}
                onClick={() => handleSticker(getStickerUrl(id))}
                aria-label={`Añadir sticker ${id}`}
              >
                <img
                  src={getStickerUrl(id)}
                  alt=""
                  width={96}
                  height={96}
                  className={styles.stickerPaletteImg}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomStickerTray;
