import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "@assets/css/contract-public.module.css";
import FormDropzone from "@shared/forms/file-upload/FormDropzone";
import {
  PREP_PROFILE_QUESTIONS,
  PrepAssetMetadata,
  PrepProfileQuestionDefinition,
} from "./questions";

type Props = {
  contractId?: number;
  mode?: "public" | "admin";
};

type PrepChange = {
  questionId: string;
  value: unknown;
};

const AUTO_CLEAR_TOAST_MS = 2000;

export function PreparationSection({ contractId, mode = "public" }: Props) {
  // Widen explicitly for stable TS inference inside JSX maps.
  const QUESTIONS =
    PREP_PROFILE_QUESTIONS as unknown as ReadonlyArray<PrepProfileQuestionDefinition>;

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  const [pendingChanges, setPendingChanges] = useState<PrepChange[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const toastTimeoutRef = useRef<number | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const isComplete = useMemo(() => {
    return QUESTIONS.every((q) => Boolean(locked[q.id]));
  }, [QUESTIONS, locked]);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(
      () => setToast(null),
      AUTO_CLEAR_TOAST_MS,
    );
  };

  const scrollToQuestion = (questionId: string) => {
    const el = cardRefs.current[questionId];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const upsertPendingChange = (questionId: string, value: unknown) => {
    setPendingChanges((prev) => {
      const idx = prev.findIndex((c) => c.questionId === questionId);
      if (idx === -1) return [...prev, { questionId, value }];
      const next = prev.slice();
      next[idx] = { questionId, value };
      return next;
    });
  };

  const onChangeAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    upsertPendingChange(questionId, value);
  };

  const saveChanges = async () => {
    if (pendingChanges.length === 0) return;
    try {
      setIsSaving(true);
      const res = await fetch("/api/preparation/changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          mode,
          changes: pendingChanges,
        }),
      });

      if (!res.ok) {
        showToast("No se pudo guardar (mock)");
        return;
      }

      // Simulación: al guardar, bloqueamos todas las preguntas que tuvieron cambios.
      setLocked((prev) => {
        const next = { ...prev };
        for (const c of pendingChanges) next[c.questionId] = true;
        return next;
      });
      setPendingChanges([]);
      showToast("Guardado");
    } catch (_e: unknown) {
      showToast("No se pudo guardar (mock)");
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (q: PrepProfileQuestionDefinition, disabled: boolean) => {
    const value = answers[q.id];
    const placeholder = q.placeholder ?? "";
    const hasHelperText = Boolean(q.placeholder);
    const placeholderForInput = hasHelperText ? "" : placeholder;

    if (q.type === "string") {
      return (
        <input
          className="form-control"
          type="text"
          value={typeof value === "string" ? value : ""}
          placeholder={placeholderForInput}
          disabled={disabled}
          onFocus={() => setActiveQuestionId(q.id)}
          onChange={(e) => onChangeAnswer(q.id, e.target.value)}
        />
      );
    }

    if (q.type === "date") {
      return (
        <input
          className="form-control"
          type="date"
          value={typeof value === "string" ? value : ""}
          disabled={disabled}
          onFocus={() => setActiveQuestionId(q.id)}
          onChange={(e) => onChangeAnswer(q.id, e.target.value)}
        />
      );
    }

    if (q.type === "boolean") {
      return (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={Boolean(value)}
            disabled={disabled}
            onFocus={() => setActiveQuestionId(q.id)}
            onChange={(e) => onChangeAnswer(q.id, e.target.checked)}
            id={`prep-q-${q.id}`}
          />
          <label
            className="form-check-label text-white"
            htmlFor={`prep-q-${q.id}`}
          >
            Sí
          </label>
        </div>
      );
    }

    if (q.type === "asset") {
      const current = value as PrepAssetMetadata | undefined;
      return (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <FormDropzone
            embedded
            multiple={false}
            disabled={disabled}
            description={
              hasHelperText
                ? "Toca para seleccionar (mock)"
                : "Selecciona una foto (mock)"
            }
            onFilesSelected={(files) => {
              const f = files[0];
              if (!f) return;
              onChangeAnswer(q.id, {
                path: `(mock)/${f.name}`,
                mime: f.type || "application/octet-stream",
              } satisfies PrepAssetMetadata);
            }}
          />
          {current?.path ? (
            <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 13 }}>
              Seleccionado:{" "}
              <span
                style={{ color: "rgba(255,255,255,0.92)", fontWeight: 900 }}
              >
                {current.path}
              </span>
            </div>
          ) : null}
        </div>
      );
    }

    if (q.type === "asset_array") {
      const current = (value as PrepAssetMetadata[] | undefined) ?? [];
      return (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <FormDropzone
            embedded
            multiple
            disabled={disabled}
            description={
              hasHelperText
                ? "Toca para seleccionar (mock)"
                : "Selecciona varias fotos (mock)"
            }
            onFilesSelected={(files) => {
              const mapped: PrepAssetMetadata[] = files.map((f) => ({
                path: `(mock)/${f.name}`,
                mime: f.type || "application/octet-stream",
              }));
              onChangeAnswer(q.id, mapped);
            }}
          />
          {current.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
              }}
            >
              {current.slice(0, 6).map((it, idx) => (
                <div
                  key={`${it.path}-${idx}`}
                  style={{
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    padding: "0.55rem 0.65rem",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 13,
                    fontWeight: 800,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={it.path}
                >
                  Foto {idx + 1}: {it.path.replace("(mock)/", "")}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    if (q.type === "object") {
      if (q.id === "dress") {
        const obj =
          (value as {
            noDress?: boolean;
            photo?: PrepAssetMetadata;
          }) ?? {};

        return (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                disabled={disabled}
                checked={Boolean(obj.noDress)}
                onFocus={() => setActiveQuestionId(q.id)}
                onChange={(e) =>
                  onChangeAnswer(q.id, {
                    ...obj,
                    noDress: e.target.checked,
                    ...(e.target.checked ? { photo: undefined } : null),
                  })
                }
                id={`prep-dress-${q.id}-hasDress`}
              />
              <label
                className="form-check-label text-white"
                htmlFor={`prep-dress-${q.id}-hasDress`}
              >
                Aún no tengo vestido
              </label>
            </div>

            {!obj.noDress ? (
              <div style={{ display: "grid", gap: "0.6rem" }}>
                <FormDropzone
                  embedded
                  multiple={false}
                  disabled={disabled}
                  description="Sube una foto del vestido (mock)"
                  onFilesSelected={(files) => {
                    const f = files[0];
                    if (!f) return;
                    onChangeAnswer(q.id, {
                      ...obj,
                      photo: {
                        path: `(mock)/${f.name}`,
                        mime: f.type || "application/octet-stream",
                      } satisfies PrepAssetMetadata,
                    });
                  }}
                />
                {obj.photo?.path ? (
                  <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 13 }}>
                    Foto seleccionada:{" "}
                    <span
                      style={{
                        color: "rgba(255,255,255,0.92)",
                        fontWeight: 900,
                      }}
                    >
                      {obj.photo.path.replace("(mock)/", "")}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      }

      if (q.id === "accessories") {
        const obj =
          (value as {
            jewelry?: PrepAssetMetadata[];
            headpiece?: PrepAssetMetadata[];
            veil?: PrepAssetMetadata[];
          }) ?? {};

        const mapFiles = (files: File[]): PrepAssetMetadata[] =>
          files.map((f) => ({
            path: `(mock)/${f.name}`,
            mime: f.type || "application/octet-stream",
          }));

        const block = (
          title: string,
          value: PrepAssetMetadata[] | undefined,
          onChange: (next: PrepAssetMetadata[]) => void,
        ) => {
          const list = value ?? [];
          return (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div
                style={{
                  color: "rgba(255,255,255,0.86)",
                  fontWeight: 900,
                  fontSize: 13,
                }}
              >
                {title}{" "}
                <span style={{ color: "rgba(255,255,255,0.62)", fontWeight: 800 }}>
                  {list.length > 0 ? `(${list.length})` : ""}
                </span>
              </div>
              <FormDropzone
                embedded
                multiple
                disabled={disabled}
                description="Selecciona fotos (mock)"
                onFilesSelected={(files) => onChange(mapFiles(files))}
              />
            </div>
          );
        };

        return (
          <div style={{ display: "grid", gap: "0.9rem" }}>
            {block("Joyería", obj.jewelry, (jewelry) =>
              onChangeAnswer(q.id, { ...obj, jewelry }),
            )}
            {block("Tocado", obj.headpiece, (headpiece) =>
              onChangeAnswer(q.id, { ...obj, headpiece }),
            )}
            {block("Velo", obj.veil, (veil) => onChangeAnswer(q.id, { ...obj, veil }))}
          </div>
        );
      }

      // Fallback (si se agrega un objeto nuevo en el futuro)
      const obj = (value as { note?: string }) ?? {};
      return (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <input
            className="form-control"
            type="text"
            placeholder={hasHelperText ? "" : "Notas (opcional)"}
            disabled={disabled}
            value={typeof obj.note === "string" ? obj.note : ""}
            onFocus={() => setActiveQuestionId(q.id)}
            onChange={(e) =>
              onChangeAnswer(q.id, { ...obj, note: e.target.value })
            }
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.contentMax} style={{ paddingBottom: 120 }}>
      {isComplete ? (
        <section className={styles.card} style={{ marginBottom: "1rem" }}>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div
              style={{
                color: "rgba(255,255,255,0.96)",
                fontWeight: 900,
                fontSize: 16,
              }}
            >
              ✅ ¡Listo! Si deseas modificar algo, contáctanos por WhatsApp.
            </div>
            <a
              className={styles.btnSecondary}
              href="https://wa.me/52XXXXXXXXXX?text=Hola,%20quiero%20ajustar%20mi%20ficha%20de%20preparación%20del%20contrato%20(SKU)"
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-block" }}
            >
              Enviar WhatsApp
            </a>
          </div>
        </section>
      ) : null}

      {toast ? (
        <div style={{ marginBottom: "0.85rem" }}>
          <div
            className={styles.badge}
            style={{
              width: "fit-content",
              background: "rgba(16, 185, 129, 0.14)",
              borderColor: "rgba(16, 185, 129, 0.3)",
              color: "rgba(209, 250, 229, 0.95)",
              fontWeight: 900,
            }}
          >
            {toast}
          </div>
        </div>
      ) : null}

      <div style={{ display: "grid", gap: "0.9rem" }}>
        {QUESTIONS.map((q) => {
          const isLocked = Boolean(locked[q.id]) && mode !== "admin";
          const badgeClass = isLocked ? styles.badgeSuccess : styles.badgeId;
          const badgeText = isLocked ? "Guardado" : "Pendiente";

          return (
            <div
              key={q.id}
              ref={(el) => {
                cardRefs.current[q.id] = el;
              }}
              onFocusCapture={() => setActiveQuestionId(q.id)}
              style={{ scrollMarginTop: 110 }}
            >
              <section className={styles.card}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h2
                      className={styles.sectionTitle}
                      style={{ marginBottom: 0 }}
                    >
                      {q.label ?? q.id}
                    </h2>
                    {q.placeholder ? (
                      <div
                        style={{
                          marginTop: 6,
                          color: "rgba(255,255,255,0.72)",
                          fontSize: 13,
                          lineHeight: 1.45,
                        }}
                      >
                        {q.placeholder}
                      </div>
                    ) : null}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexShrink: 0,
                    }}
                  >
                    <span className={[styles.badge, badgeClass].join(" ")}>
                      {badgeText}
                    </span>
                  </div>
                </div>

                <div className={styles.sectionBody}>
                  {renderInput(q, isLocked)}
                </div>
              </section>
            </div>
          );
        })}
      </div>

      <div className={styles.ctaSticky}>
        <div className={styles.ctaSurface}>
          <div style={{ display: "grid", gap: "0.65rem" }}>
            <div style={{ color: "rgba(255,255,255,0.9)", fontWeight: 900 }}>
              Guardar cambios
            </div>

            <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 13 }}>
              {pendingChanges.length > 0 ? (
                <>
                  Cambios pendientes:{" "}
                  <span
                    style={{ color: "rgba(255,255,255,0.92)", fontWeight: 900 }}
                  >
                    {pendingChanges.length}
                  </span>
                </>
              ) : (
                <>No hay cambios pendientes.</>
              )}
            </div>

            <button
              type="button"
              className={styles.btnPrimary}
              onClick={saveChanges}
              disabled={pendingChanges.length === 0 || isSaving}
              style={{
                opacity: pendingChanges.length === 0 || isSaving ? 0.55 : 1,
                cursor:
                  pendingChanges.length === 0 || isSaving
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
