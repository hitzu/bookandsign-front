"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { EventPhoto } from "../../../interfaces";
import PolaroidCanvas, {
  type PolaroidCropHandle,
  type CropData,
} from "./PolaroidCanvas";
import PolaroidFrame from "./PolaroidFrame";
import type { StepCustomizeHandle } from "./StepCustomizePhoto";
import type { StepDedicateHandle } from "./StepDedicate";
import TopEditorBar from "./TopEditorBar";
import BottomStickerTray from "./BottomStickerTray";
import BottomPhraseTray from "./BottomPhraseTray";
import ConfirmDedicateDialog from "./ConfirmDedicateDialog";
import BackStepAlert from "./BackStepAlert";
import type { DedicationPhrase } from "../utils/dedicationPhrases";
import { SocialMediaCTA } from "./SocialMediaCTA";
import { useModalStateMachine } from "../hooks/useModalStateMachine";
import styles from "@assets/css/party-public.module.css";

const StepCustomizePhoto = dynamic(
  () => import("./StepCustomizePhoto").then((m) => m.default),
  { ssr: false },
);

const StepDedicate = dynamic(
  () => import("./StepDedicate").then((m) => m.default),
  { ssr: false },
);

/* ── Types ── */

type WizardStep = 1 | 2 | 3;
type DedicatePhotoModalProps = {
  isOpen: boolean;
  photo: EventPhoto | null;
  eventToken?: string;
  onClose: () => void;
  onToast?: (message: string) => void;
  nombreFestejado?: string;
};

const STEP_LABELS: Record<WizardStep, string> = {
  1: "Paso 1: Encuadra tu foto",
  2: "Paso 2: Personaliza",
  3: "Paso 3: Dedica",
};

const BACK_MESSAGES: Record<2 | 3, string> = {
  2: "Si regresas, perderas los stickers que agregaste.",
  3: "Si regresas, perderas tu dedicatoria.",
};

/* ── Component ── */

const DedicatePhotoModal = ({
  isOpen,
  photo,
  eventToken,
  onClose,
  onToast,
  nombreFestejado = "",
}: DedicatePhotoModalProps) => {
  const { state: modalState, dispatch } =
    useModalStateMachine("dedicate-step-1");

  const [step, setStep] = useState<WizardStep>(1);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isPhraseTrayOpen, setIsPhraseTrayOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBackAlert, setShowBackAlert] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data flowing between steps
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [composedPhotoUrl, setComposedPhotoUrl] = useState<string | null>(null);
  const [dedicationText, setDedicationText] = useState("");

  // Child API handles (via onReady callbacks, not refs — dynamic() breaks ref forwarding)
  const cropRef = useRef<PolaroidCropHandle>(null);
  const [customizeApi, setCustomizeApi] = useState<StepCustomizeHandle | null>(
    null,
  );
  const [dedicateApi, setDedicateApi] = useState<StepDedicateHandle | null>(
    null,
  );

  /* ── Lock scroll ── */

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

  /* ── Reset on close ── */

  useEffect(() => {
    if (!isOpen) {
      dispatch({ type: "OPEN_DEDICATE" });
      setStep(1);
      setIsTrayOpen(false);
      setIsPhraseTrayOpen(false);
      setShowConfirm(false);
      setShowBackAlert(false);
      setIsProcessing(false);
      setCropData(null);
      setDedicationText("");
      setCustomizeApi(null);
      setDedicateApi(null);
      // Revoke blob URL
      if (composedPhotoUrl) {
        URL.revokeObjectURL(composedPhotoUrl);
        setComposedPhotoUrl(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ── Navigation: forward ── */

  const handleNextFromStep1 = useCallback(() => {
    if (!cropRef.current) return;
    const data = cropRef.current.getCrop();
    setCropData(data);
    dispatch({ type: "DEDICATE_NEXT" });
    setStep(2);
  }, [dispatch]);

  const handleNextFromStep2 = useCallback(async () => {
    if (!customizeApi) return;
    try {
      const blob = await customizeApi.exportToBlob();
      const url = URL.createObjectURL(blob);
      // Revoke previous if any
      if (composedPhotoUrl) URL.revokeObjectURL(composedPhotoUrl);
      setComposedPhotoUrl(url);
      dispatch({ type: "DEDICATE_NEXT" });
      setStep(3);
    } catch (err) {
      console.error("Failed to compose photo:", err);
      onToast?.("Error al procesar la foto");
    }
  }, [customizeApi, onToast]);

  /* ── Navigation: back (destructive with alert) ── */

  const handleBackRequest = useCallback(() => {
    if (step === 1) {
      onClose();
      return;
    }
    setShowBackAlert(true);
  }, [step, onClose]);

  const handleBackConfirm = useCallback(() => {
    setShowBackAlert(false);
    dispatch({ type: "DEDICATE_BACK" });
    if (step === 2) {
      setCropData(null);
      setStep(1);
    } else if (step === 3) {
      if (composedPhotoUrl) URL.revokeObjectURL(composedPhotoUrl);
      setComposedPhotoUrl(null);
      setDedicationText("");
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, step]);

  /* ── Sticker handling (Paso 2 only) ── */

  const handleSelectSticker = useCallback(
    (url: string) => {
      customizeApi?.addSticker(url);
    },
    [customizeApi],
  );

  /* ── Phrase selection (Paso 3) ── */

  const handleSelectPhrase = useCallback((phrase: DedicationPhrase) => {
    setDedicationText((prev) => {
      if (!prev.trim()) return phrase.text;
      return `${prev} ${phrase.text}`;
    });
  }, []);

  /* ── Submit dedication ── */

  const handleDedicateClick = useCallback(() => {
    dispatch({ type: "DEDICATE_OPEN_CONFIRM" });
    setShowConfirm(true);
  }, [dispatch]);

  const handleConfirmDedicate = useCallback(async () => {
    if (!dedicateApi || isProcessing) return;
    setIsProcessing(true);
    dispatch({ type: "DEDICATE_CONFIRM_SUBMIT" });

    try {
      const blob = await dedicateApi.exportToBlob();
      const now = new Date();
      const stamp = now.toISOString().replace(/[:.]/g, "-");
      const fileName = `photo_dedicated_${stamp}.jpg`;

      // Upload to S3 — NO download to device
      if (eventToken) {
        const { uploadDevotedPhoto } =
          await import("../utils/uploadDevotedPhoto");
        await uploadDevotedPhoto({ eventToken, blob, fileName });
      }

      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.85 },
        ticks: 500,
      });

      setShowConfirm(false);
      dispatch({ type: "DEDICATE_UPLOAD_SUCCESS" });
      onToast?.("Tu dedicatoria fue enviada");
    } catch (err) {
      console.error("Dedicate failed:", err);
      setShowConfirm(false);
      setIsProcessing(false);
      dispatch({ type: "DEDICATE_UPLOAD_ERROR" });
    }
  }, [dedicateApi, dispatch, eventToken, isProcessing, onToast]);

  /* ── Render ── */

  if (!isOpen || !photo) return null;

  if (modalState === "dedicate-error") {
    return (
      <div className={styles.dedicateOverlay} role="dialog" aria-modal="true">
        <div className={styles.postDescargaOverlayContent}>
          <p className={styles.endStateTitulo}>
            Ocurrió un error al enviar tu dedicatoria
          </p>
          <div className={styles.dedicateErrorActions}>
            <button
              type="button"
              className={styles.dedicateNextBtn}
              onClick={() => {
                dispatch({ type: "DEDICATE_RETRY" });
                handleConfirmDedicate();
              }}
            >
              Reintentar
            </button>
            <button
              type="button"
              className={styles.dedicateBackLink}
              onClick={() => dispatch({ type: "DEDICATE_BACK_TO_EDIT" })}
            >
              Volver a editar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (modalState === "dedicate-success") {
    return (
      <div className={styles.dedicateOverlay} role="dialog" aria-modal="true">
        <div className={styles.postDescargaOverlayContent}>
          <SocialMediaCTA
            context="dedicated"
            nombreFestejado={nombreFestejado}
          />
          <button
            type="button"
            className={styles.returnToGalleryBtn}
            onClick={onClose}
          >
            Regresar a la galería
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dedicateOverlay} role="dialog" aria-modal="true">
      <div className={styles.dedicateRoot}>
        {/* Step indicator — 3 dots */}
        <div className={styles.dedicateStepIndicator}>
          {([1, 2, 3] as WizardStep[]).map((s) => (
            <div
              key={s}
              className={`${styles.dedicateStepDot} ${s === step ? styles.dedicateStepDotActive : ""}`}
            />
          ))}
          <span className={styles.dedicateStepLabel}>{STEP_LABELS[step]}</span>
        </div>

        {/* ── Step 1: Crop ── */}
        {step === 1 && (
          <>
            <div className={styles.step1PolaroidWrap}>
              <PolaroidCanvas ref={cropRef} imageUrl={photo.publicUrl} />
              <header className={styles.topEditorBar}>
                <button
                  type="button"
                  className={styles.topEditorBackBtn}
                  onClick={onClose}
                  aria-label="Cerrar"
                >
                  ← Cerrar
                </button>
              </header>
            </div>
            <footer className={styles.dedicateFooter}>
              <button
                type="button"
                className={styles.dedicateNextBtn}
                onClick={handleNextFromStep1}
              >
                Siguiente
              </button>
            </footer>
          </>
        )}

        {/* ── Step 2: Customize (Fabric.js + stickers) ── */}
        {step === 2 && cropData && (
          <>
            <PolaroidFrame>
              <div className={styles.canvasWrapper}>
                <StepCustomizePhoto
                  imageUrl={photo.publicUrl}
                  crop={cropData}
                  onReady={setCustomizeApi}
                />
                <TopEditorBar
                  onBack={handleBackRequest}
                  onStickers={() => setIsTrayOpen(true)}
                  backLabel="Regresar"
                />
              </div>
            </PolaroidFrame>
            <footer className={styles.dedicateFooter}>
              <button
                type="button"
                className={styles.dedicateNextBtn}
                onClick={handleNextFromStep2}
              >
                Siguiente
              </button>
            </footer>
          </>
        )}

        {/* ── Step 3: Dedicate (polaroid + text + phrases) ── */}
        {step === 3 && composedPhotoUrl && (
          <>
            <div className={styles.canvasWrapper}>
              <StepDedicate
                composedPhotoUrl={composedPhotoUrl}
                dedicationText={dedicationText}
                onDedicationTextChange={setDedicationText}
                onReady={setDedicateApi}
              />
              <TopEditorBar
                onBack={handleBackRequest}
                onStickers={() => setIsPhraseTrayOpen(true)}
                backLabel="Regresar"
                actionLabel="Frases"
                actionEmoji="💬"
              />
            </div>
            <footer className={styles.dedicateFooter}>
              <button
                type="button"
                className={styles.dedicateNextBtn}
                onClick={handleDedicateClick}
              >
                Enviar dedicatoria
              </button>
            </footer>
          </>
        )}
      </div>

      {/* Sticker tray — only in step 2 */}
      {step === 2 && (
        <BottomStickerTray
          isOpen={isTrayOpen}
          onClose={() => setIsTrayOpen(false)}
          onSelectSticker={handleSelectSticker}
        />
      )}

      {/* Phrase tray — only in step 3 */}
      {step === 3 && (
        <BottomPhraseTray
          isOpen={isPhraseTrayOpen}
          eventToken={eventToken || ""}
          onClose={() => setIsPhraseTrayOpen(false)}
          onSelectPhrase={handleSelectPhrase}
        />
      )}

      {/* Confirm send dialog */}
      <ConfirmDedicateDialog
        isOpen={showConfirm}
        isProcessing={isProcessing}
        onCancel={() => {
          dispatch({ type: "DEDICATE_CANCEL_CONFIRM" });
          setShowConfirm(false);
          setIsProcessing(false);
        }}
        onConfirm={handleConfirmDedicate}
      />

      {/* Back step alert */}
      <BackStepAlert
        isOpen={showBackAlert}
        message={step > 1 ? BACK_MESSAGES[step as 2 | 3] : ""}
        onStay={() => setShowBackAlert(false)}
        onGoBack={handleBackConfirm}
      />
    </div>
  );
};

export default DedicatePhotoModal;
