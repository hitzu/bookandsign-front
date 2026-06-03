import { useEffect, useRef, useState } from "react";
import styles from "@assets/css/expo-bebe.module.css";
import { EXTRAS, SERVICES } from "../data/serviceCatalog";
import type { ServiceItem } from "../types";
import { IconChevronLeft, IconChevronRight } from "./Icons";

export function ServicesCarousel({
  onOpenDetail,
}: {
  onOpenDetail: (s: ServiceItem) => void;
}) {
  const [mode, setMode] = useState<"servicios" | "extras">("servicios");
  const [idx, setIdx] = useState(0);
  const touchStart = useRef<number | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const items = mode === "servicios" ? SERVICES : EXTRAS;
  const total = items.length;

  useEffect(() => {
    setIdx(0);
  }, [mode]);

  useEffect(() => {
    autoRef.current = setInterval(() => setIdx((i) => (i + 1) % total), 6000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [total, mode]);

  const go = (n: number) => {
    if (autoRef.current) clearInterval(autoRef.current);
    setIdx(((n % total) + total) % total);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
    touchStart.current = null;
  };

  return (
    <section className={styles.panel}>
      {/* Stickers */}
      <img
        src="/assets/expo-bebe/sticker-duck.png"
        alt=""
        className={styles.stickerTopLeft}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <img
        src="/assets/expo-bebe/sticker-bear-blue.png"
        alt=""
        className={styles.stickerTopRight}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      {/* Mode toggle */}
      <div className={styles.modeToggle}>
        {(["servicios", "extras"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            className={`${styles.modeBtn} ${mode === opt ? styles.modeBtnActive : ""}`}
            onClick={() => setMode(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div
        className={styles.carousel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.carCounter}>
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        <button
          className={`${styles.carArrow} ${styles.carArrowPrev}`}
          onClick={() => go(idx - 1)}
          aria-label="Anterior"
          type="button"
        >
          <IconChevronLeft />
        </button>
        <button
          className={`${styles.carArrow} ${styles.carArrowNext}`}
          onClick={() => go(idx + 1)}
          aria-label="Siguiente"
          type="button"
        >
          <IconChevronRight />
        </button>

        <div
          className={styles.carTrack}
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {items.map((s, i) => (
            <div
              key={`${mode}-${i}`}
              className={styles.carSlide}
              onClick={() => onOpenDetail(s)}
              style={{ background: s.bg }}
            >
              <div className={styles.slidePhoto}>
                <div className={styles.slidePhotoStripe} />
                <div className={styles.slidePhotoLabel}>{s.label}</div>
                <div className={styles.slideDetailBadge}>Ver detalles</div>
              </div>
              <div className={styles.slideCaption}>
                <div className={styles.slideEyebrow}>{s.eyebrow}</div>
                <h3 className={styles.slideTitle}>
                  {s.title[0]}{" "}
                  <span className={styles.slideTitleAc}>{s.title[1]}</span>
                </h3>
                <p className={styles.slideDesc}>{s.desc}</p>
                <div className={styles.slidePrice}>
                  <span className={styles.slidePriceLabel}>Precio expo</span>
                  <span className={styles.slidePriceVal}>{s.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === idx ? styles.dotActive : ""}`}
            onClick={() => go(i)}
            aria-label={`Item ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
