"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { EventPhoto } from "../../../interfaces";
import TopEditorBar from "./TopEditorBar";
import BottomStickerTray from "./BottomStickerTray";
import DownloadCTA from "./DownloadCTA";
import styles from "@assets/css/party-public.module.css";

const PersonalizeCanvas = dynamic(
  () => import("./PersonalizeCanvas").then((m) => m.default),
  { ssr: false },
);

type PersonalizePhotoModalProps = {
  isOpen: boolean;
  photo: EventPhoto | null;
  eventToken?: string;
  onClose: () => void;
  onDownload?: (blob: Blob) => void;
  onToast?: (message: string) => void;
};

const PersonalizePhotoModal = ({
  isOpen,
  photo,
  eventToken,
  onClose,
  onDownload,
  onToast,
}: PersonalizePhotoModalProps) => {
  const [exportToBlob, setExportToBlob] = useState<
    (() => Promise<Blob>) | null
  >(null);
  const [editApi, setEditApi] = useState<{
    addSticker: (url: string) => void;
  } | null>(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [hintSubdued, setHintSubdued] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCanvasReady = useCallback(
    (api: {
      exportToBlob: () => Promise<Blob>;
      addSticker: (url: string) => void;
    }) => {
      setExportToBlob(() => api.exportToBlob);
      setEditApi({ addSticker: api.addSticker });
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) {
      setExportToBlob(null);
      setEditApi(null);
      setIsTrayOpen(false);
      setHintSubdued(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !photo) return;
    const timer = window.setTimeout(() => setHintSubdued(true), 2500);
    return () => window.clearTimeout(timer);
  }, [isOpen, photo]);

  const handleSelectSticker = useCallback(
    (url: string) => {
      editApi?.addSticker(url);
    },
    [editApi],
  );

  const handleDownload = useCallback(async () => {
    if (!exportToBlob || isProcessing) return;

    setIsProcessing(true);

    try {
      const blob = await exportToBlob();
      const { buildPersonalizedPhotoFilename, downloadBlob } = await import(
        "../utils/personalizeExport"
      );
      const filename = buildPersonalizedPhotoFilename();

      downloadBlob(blob, filename);
      onDownload?.(blob);

      let uploadFailed = false;
      if (eventToken) {
        try {
          const { uploadPersonalizedPhoto } = await import(
            "../utils/uploadPersonalizedPhoto"
          );
          await uploadPersonalizedPhoto({
            eventToken,
            blob,
            fileName: filename,
          });
        } catch (uploadError) {
          uploadFailed = true;
          console.error("Cloud upload failed:", uploadError);
        }
      }

      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.85 },
        ticks: 400,
      });

      if (eventToken) {
        onToast?.(
          uploadFailed
            ? "Foto descargada. No pudimos guardar la copia en la nube."
            : "Foto descargada y guardada ✨",
        );
      } else {
        onToast?.("Foto descargada ✨");
      }
    } catch (err) {
      console.error("Download failed:", err);
      onToast?.("No se pudo descargar");
    } finally {
      setIsProcessing(false);
    }
  }, [eventToken, exportToBlob, isProcessing, onDownload, onToast]);

  if (!isOpen) return null;

  return (
    <div className={styles.personalizeOverlay} role="dialog" aria-modal="true">
      <div className={styles.editorRoot}>
        <div className={styles.canvasWrapper}>
          {photo ? (
            <PersonalizeCanvas
              imageUrl={photo.publicUrl}
              onCanvasReady={handleCanvasReady}
              isTrayOpen={isTrayOpen}
            />
          ) : (
            <p className={styles.personalizePlaceholder}>Selecciona una foto</p>
          )}
          <TopEditorBar
            onBack={onClose}
            onStickers={() => setIsTrayOpen(true)}
          />
        </div>
        {photo && (
          <footer className={styles.footerWrapper}>
            <DownloadCTA
              onDownload={handleDownload}
              disabled={!exportToBlob || isProcessing}
              label={isProcessing ? "Guardando foto..." : "Descargar foto"}
            />
          </footer>
        )}
      </div>
      {editApi && (
        <BottomStickerTray
          isOpen={isTrayOpen}
          onClose={() => setIsTrayOpen(false)}
          onSelectSticker={handleSelectSticker}
        />
      )}
    </div>
  );
};

export default PersonalizePhotoModal;
