import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Select from "react-select";
import NonLayout from "@layout/NonLayout";
import logoWhite from "@assets/images/logo-white.png";
import styles from "../../assets/css/calendar.module.css";
import Image from "next/image";
import { Row, Col } from "react-bootstrap";
import { getSlotsByMonthAndYear } from "../../api/services/slotsService";
import { MEDIA_MANIFEST } from "../../media/mediaManifest";
import {
  CalendarSlotsByMonthResponse,
  SlotAvailabilityStatus,
} from "../../interfaces";

type WeekendKey = "fri" | "sat" | "sun";
type WeekendWeekRow = {
  key: string; // YYYY-MM-DD (monday of that week)
  days: Partial<Record<WeekendKey, Date>>;
};

type MainSectionKey = "calendar" | "transportation-fee" | "photos";

const WEEKEND_HEADER_LABELS: Record<WeekendKey, string> = {
  fri: "Viernes",
  sat: "Sábado",
  sun: "Domingo",
};

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const startOfWeekMonday = (d: Date) => {
  // Monday-based week to group Fri/Sat/Sun into a stable "calendar week row".
  const day = d.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  const daysSinceMonday = (day + 6) % 7;
  const monday = new Date(d);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(d.getDate() - daysSinceMonday);
  return monday;
};

type SectionTabsProps = {
  active: MainSectionKey;
  onChange: (next: MainSectionKey) => void;
};

const SectionTabs = ({ active, onChange }: SectionTabsProps) => {
  const items: Array<{ key: MainSectionKey; label: string }> = [
    { key: "calendar", label: "Calendario" },
    { key: "transportation-fee", label: "Tarifa de traslado" },
    { key: "photos", label: "Fotos" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Secciones"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 12,
        padding: "10px 12px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {items.map((it) => {
        const isActive = active === it.key;
        return (
          <button
            key={it.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(it.key)}
            style={{
              borderRadius: 999,
              padding: "10px 18px",
              fontSize: 18,
              lineHeight: 1,
              border: "1px solid rgba(255,255,255,0.25)",
              background: isActive
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.15)",
              color: "white",
              minWidth: 130,
              touchAction: "manipulation",
            }}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
};

const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`fade ${shown ? "show" : ""}`} style={{ width: "100%" }}>
      {children}
    </div>
  );
};

type PhotosCollection = {
  id: string;
  title: string;
};

type PhotosItem = {
  id: string;
  type: "image";
  src: string;
  fallbackSrc?: string;
  alt: string;
};

type PhotosSectionProps = {
  collections: PhotosCollection[];
  selectedCollectionId: string;
  onSelectCollection: (id: string) => void;
  resetToken: number;
  itemsByCollection: Record<string, PhotosItem[]>;
  isLoading: boolean;
  error: string | null;
};

const PhotosSection = ({
  collections,
  selectedCollectionId,
  onSelectCollection,
  resetToken,
  itemsByCollection,
  isLoading,
  error,
}: PhotosSectionProps) => {
  const items = itemsByCollection[selectedCollectionId] ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset carousel position when switching away/back (but keep selectedCollectionId)
  useEffect(() => {
    setActiveIndex(0);
    setIsFullscreen(false);
  }, [resetToken]);

  // Reset carousel when changing collection
  useEffect(() => {
    setActiveIndex(0);
    setIsFullscreen(false);
  }, [selectedCollectionId]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const goPrev = () =>
    setActiveIndex((i) => {
      if (items.length <= 1) return 0;
      return (i - 1 + items.length) % items.length;
    });
  const goNext = () =>
    setActiveIndex((i) => {
      if (items.length <= 1) return 0;
      return (i + 1) % items.length;
    });

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    touchStart.current = null;

    // Ignore mostly-vertical gestures (prevent accidental scroll-like swipes)
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const activeItem = items[activeIndex];

  // Prevent background scroll while fullscreen and allow ESC to close.
  useEffect(() => {
    if (!isFullscreen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen, items.length]);

  const openFullscreen = () => {
    if (!activeItem) return;
    setIsFullscreen(true);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Filter pills (tabs) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          padding: "8px 12px 12px",
          flexWrap: "wrap",
        }}
      >
        {collections.map((c) => {
          const isActive = c.id === selectedCollectionId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCollection(c.id)}
              style={{
                borderRadius: 999,
                padding: "10px 16px",
                fontSize: 18,
                border: "1px solid rgba(255,255,255,0.25)",
                background: isActive
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.12)",
                color: "white",
                touchAction: "manipulation",
              }}
            >
              {c.title}
            </button>
          );
        })}
      </div>

      {/* Carousel (placeholder, touch-first) */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          width: "100%",
          maxWidth: 820,
          margin: "0 auto",
          padding: "0 12px",
          touchAction: "pan-y", // allow vertical page scroll, but we ignore vertical swipe intent inside
        }}
      >
        <div
          onClick={openFullscreen}
          style={{
            width: "100%",
            aspectRatio: "4 / 5",
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            cursor: activeItem ? "zoom-in" : "default",
          }}
          aria-label="Carrusel de fotos"
        >
          <div
            style={{
              textAlign: "center",
              padding: 18,
              maxWidth: 520,
            }}
          >
            {isLoading && (
              <div style={{ fontSize: 18, opacity: 0.9 }}>Cargando fotos…</div>
            )}
            {!isLoading && error && (
              <div style={{ fontSize: 18, opacity: 0.9 }}>{error}</div>
            )}
            {!isLoading && !error && !activeItem && (
              <div style={{ fontSize: 18, opacity: 0.9 }}>
                No hay fotos en esta colección.
              </div>
            )}
          </div>

          {!isLoading && !error && activeItem && (
            <Image
              src={activeItem.src}
              alt={activeItem.alt}
              fill
              sizes="(max-width: 900px) 92vw, 820px"
              style={{ objectFit: "contain" }}
              // Supabase public URLs are already CDN-friendly; bypass Next image optimizer
              // to avoid 400s from remote pattern/URL encoding edge cases (e.g. spaces).
              unoptimized
              onError={(e) => {
                const img = e.currentTarget as unknown as HTMLImageElement;
                if (
                  activeItem.fallbackSrc &&
                  img.src !== activeItem.fallbackSrc
                ) {
                  img.src = activeItem.fallbackSrc;
                }
              }}
              priority={activeIndex === 0}
            />
          )}

          {/* Non-interactive overlay copy (always visible) */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "14px 16px",
              background:
                "linear-gradient(transparent, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.7))",
              pointerEvents: "none",
            }}
          >
            <div style={{ fontSize: 16, opacity: 0.9 }}>
              {collections.find((c) => c.id === selectedCollectionId)?.title ??
                "Fotos"}
              {items.length > 0 ? ` · ${activeIndex + 1}/${items.length}` : ""}
            </div>
          </div>
        </div>

        {/* Big dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            padding: "14px 0 10px",
          }}
          aria-label="Indicadores"
        >
          {items.map((it, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Ir a elemento ${idx + 1}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.6)",
                  background: isActive
                    ? "rgba(255,255,255,0.85)"
                    : "transparent",
                  padding: 0,
                  touchAction: "manipulation",
                }}
              />
            );
          })}
        </div>

        {/* One-hand hint */}
        <div
          style={{
            textAlign: "center",
            fontSize: 16,
            opacity: 0.85,
            paddingBottom: 8,
          }}
        >
          {items.length > 0
            ? "Desliza para cambiar · Toca un punto para saltar"
            : isLoading
            ? "Preparando galería…"
            : "Sin elementos para mostrar"}
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto en pantalla completa"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setIsFullscreen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(false);
            }}
            aria-label="Cerrar"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 46,
              height: 46,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              fontSize: 28,
              lineHeight: "46px",
              textAlign: "center",
              padding: 0,
              touchAction: "manipulation",
            }}
          >
            ×
          </button>

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(1100px, 100%)",
              height: "min(92vh, 900px)",
            }}
          >
            <Image
              src={activeItem.src}
              alt={activeItem.alt}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
              unoptimized
              onError={(e) => {
                const img = e.currentTarget as unknown as HTMLImageElement;
                if (
                  activeItem.fallbackSrc &&
                  img.src !== activeItem.fallbackSrc
                ) {
                  img.src = activeItem.fallbackSrc;
                }
              }}
              priority
            />

            {/* Footer text */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "14px 16px",
                background:
                  "linear-gradient(transparent, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.7))",
                pointerEvents: "none",
                color: "white",
              }}
            >
              <div style={{ fontSize: 16, opacity: 0.9 }}>
                {collections.find((c) => c.id === selectedCollectionId)
                  ?.title ?? "Fotos"}
                {items.length > 0
                  ? ` · ${activeIndex + 1}/${items.length}`
                  : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type MapSectionProps = {
  resetToken: number;
};

const MapSection = ({ resetToken }: MapSectionProps) => {
  const [municipio, setMunicipio] = useState("");
  const [query, setQuery] = useState("Puebla, México");

  // Reset map UI state when returning from other sections
  useEffect(() => {
    setMunicipio("");
    setQuery("Puebla, México");
  }, [resetToken]);

  const iframeSrc = useMemo(() => {
    const q = encodeURIComponent(query);
    // No APIs/backends: use simple Google Maps embed query
    return `https://www.google.com/maps?q=${q}&output=embed`;
  }, [query]);

  return (
    <div
      style={{ width: "100%", maxWidth: 980, margin: "0 auto", padding: 12 }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ minWidth: 260, flex: "1 1 360px" }}>
          <div style={{ color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>
            Municipio del evento
          </div>
          <input
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
            placeholder="Municipio del evento"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(0,0,0,0.18)",
              color: "white",
              fontSize: 18,
              outline: "none",
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            const trimmed = municipio.trim();
            setQuery(trimmed ? `${trimmed}, México` : "Puebla, México");
          }}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(255,255,255,0.12)",
            color: "white",
            fontSize: 18,
            touchAction: "manipulation",
            minWidth: 120,
          }}
        >
          Buscar
        </button>
      </div>

      <div
        style={{
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <iframe
          title="Mapa"
          src={iframeSrc}
          width="100%"
          height="420"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div style={{ marginTop: 14, opacity: 0.9, fontSize: 16 }}>
        Costo de viáticos se confirma posteriormente.
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [monthData, setMonthData] = useState<CalendarSlotsByMonthResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeSection, setActiveSection] =
    useState<MainSectionKey>("calendar");
  const [photosCollectionId, setPhotosCollectionId] = useState<string>("");
  const [photosResetToken, setPhotosResetToken] = useState(0);
  const [mapResetToken, setMapResetToken] = useState(0);

  const photosCollections: PhotosCollection[] = useMemo(() => {
    return (MEDIA_MANIFEST.sections ?? []).map((s) => ({
      id: s.key,
      title: s.label,
    }));
  }, []);

  const photosItemsByCollection: Record<string, PhotosItem[]> = useMemo(() => {
    const out: Record<string, PhotosItem[]> = {};
    for (const s of MEDIA_MANIFEST.sections ?? []) {
      out[s.key] = (s.photos ?? []).map((p, idx) => ({
        id: `${s.key}:${idx}`,
        type: "image" as const,
        src: p.src,
        fallbackSrc: p.fallbackSrc,
        alt: `${s.label} - ${idx + 1}`,
      }));
    }
    return out;
  }, []);

  const photosLoading = false;
  const photosError: string | null = null;

  const currentYear = currentDate.getFullYear();

  const years = [currentYear, currentYear + 1, currentYear + 2];
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getSlotsByMonthAndYear(
          selectedMonth + 1,
          selectedYear
        );
        setMonthData(data);
      } catch (e) {
        console.error(e);
        setMonthData([]);
        setError("No se pudo cargar la disponibilidad del mes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlots();
  }, [selectedMonth, selectedYear]);

  // Always open first collection by order (manifest order).
  useEffect(() => {
    if (!photosCollectionId && photosCollections.length > 0) {
      setPhotosCollectionId(photosCollections[0].id);
    }
  }, [photosCollectionId, photosCollections]);

  // Preload first collection photos for instant swiping.
  useEffect(() => {
    const firstId = photosCollections[0]?.id;
    if (!firstId) return;
    const items = photosItemsByCollection[firstId] ?? [];
    if (typeof window === "undefined") return;

    const top = items.slice(0, 12);
    for (const t of top) {
      const img = new window.Image();
      img.src = t.src;
      if (t.fallbackSrc) {
        const img2 = new window.Image();
        img2.src = t.fallbackSrc;
      }
    }
  }, [photosCollections, photosItemsByCollection]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
  };

  const availabilityByDate = useMemo(() => {
    const map = new Map<
      string,
      {
        morning: SlotAvailabilityStatus;
        afternoon: SlotAvailabilityStatus;
      }
    >();
    for (const d of monthData) {
      map.set(d.date, d.slots);
    }
    return map;
  }, [monthData]);

  const weekendWeeks = useMemo<WeekendWeekRow[]>(() => {
    const first = new Date(selectedYear, selectedMonth, 1);
    const last = new Date(selectedYear, selectedMonth + 1, 0);
    first.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);

    const byWeek = new Map<string, WeekendWeekRow>();

    for (let day = 1; day <= last.getDate(); day++) {
      const d = new Date(selectedYear, selectedMonth, day);
      const dow = d.getDay();
      const isFri = dow === 5;
      const isSat = dow === 6;
      const isSun = dow === 0;
      if (!isFri && !isSat && !isSun) continue;

      const monday = startOfWeekMonday(d);
      const key = toYMD(monday);
      const row: WeekendWeekRow = byWeek.get(key) ?? { key, days: {} };
      if (isFri) row.days.fri = d;
      if (isSat) row.days.sat = d;
      if (isSun) row.days.sun = d;
      byWeek.set(key, row);
    }

    return Array.from(byWeek.values()).sort((a, b) =>
      a.key.localeCompare(b.key)
    );
  }, [selectedMonth, selectedYear]);

  const getStatus = (
    ymd: string,
    slot: "morning" | "afternoon"
  ): SlotAvailabilityStatus => {
    return availabilityByDate.get(ymd)?.[slot] ?? "available";
  };

  const onChangeSection = (next: MainSectionKey) => {
    setActiveSection((prev) => {
      if (prev !== "photos" && next === "photos") {
        // Reset Photos "status" when returning from other sections, but keep filter
        setPhotosResetToken((t) => t + 1);
      }
      if (prev !== "transportation-fee" && next === "transportation-fee") {
        setMapResetToken((t) => t + 1);
      }
      return next;
    });
  };

  return (
    <div className={styles.calendarContainer}>
      <Row className="justify-content-center">
        <Col>
          <Row className="mb-2">
            <Col className="text-center">
              <Image src={logoWhite} alt="logo" width={90} height={90} />
            </Col>
          </Row>

          <SectionTabs active={activeSection} onChange={onChangeSection} />

          {activeSection === "calendar" && (
            <FadeInSection>
              <Row className="g-2 justify-content-center">
                <Col xs={12}>
                  <h1 className={styles.title}>Disponibilidad</h1>
                </Col>

                {/* Year Selector */}
                <Col xs={12}>
                  <Row className="g-2 justify-content-center">
                    {years.map((year) => (
                      <Col xs="auto" key={year}>
                        <button
                          className={`${styles.yearButton} ${
                            selectedYear === year ? styles.yearButtonActive : ""
                          }`}
                          onClick={() => handleYearChange(year)}
                          type="button"
                        >
                          {year}
                        </button>
                      </Col>
                    ))}
                  </Row>
                </Col>

                {/* Month Selector */}
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={5}
                  className="justify-content-center"
                >
                  <div className={styles.monthSelectorWrapper}>
                    <Select
                      value={months
                        .map((month, index) => ({
                          value: index,
                          label: month,
                        }))
                        .find((m) => m.value === selectedMonth)}
                      options={months.map((month, index) => ({
                        value: index,
                        label: month,
                      }))}
                      onChange={(e) => {
                        if (e?.value !== undefined) {
                          handleMonthChange(Number(e.value));
                        }
                      }}
                      className={styles.monthSelect}
                      classNamePrefix="monthSelect"
                      isSearchable={false}
                    />
                  </div>
                </Col>

                {/* Weekend month grid (Fri/Sat/Sun only) */}
                <Col xs={12}>
                  {error && <div className={styles.loadError}>{error}</div>}
                  {isLoading && (
                    <div className={styles.loadHint}>
                      Cargando disponibilidad…
                    </div>
                  )}

                  <div className={styles.weekendGridHeader}>
                    {(["fri", "sat", "sun"] as WeekendKey[]).map((k) => (
                      <div key={k} className={styles.weekendHeaderCell}>
                        {WEEKEND_HEADER_LABELS[k]}
                      </div>
                    ))}
                  </div>

                  <div className={styles.weekendGrid}>
                    {weekendWeeks.map((week) => (
                      <div key={week.key} className={styles.weekRow}>
                        {(["fri", "sat", "sun"] as WeekendKey[]).map((k) => {
                          const d = week.days[k];
                          if (!d) {
                            return (
                              <div key={k} className={styles.dayCellEmpty} />
                            );
                          }

                          const ymd = toYMD(d);
                          const morning = getStatus(ymd, "morning");
                          const afternoon = getStatus(ymd, "afternoon");

                          const statusText = (s: SlotAvailabilityStatus) =>
                            s === "available" ? "Disponible" : "Ocupado";
                          const statusIcon = (s: SlotAvailabilityStatus) =>
                            s === "available" ? "✓" : "✕";

                          return (
                            <div key={k} className={styles.dayCell}>
                              <div className={styles.dayHeaderCompact}>
                                <div className={styles.dayNumberCompact}>
                                  {d.getDate()}
                                </div>
                              </div>

                              {/* Two lines only: Disponible / Ocupado (no Mañana/Tarde labels) */}
                              <div className={styles.daySlots}>
                                <div
                                  className={`${styles.slotPill} ${
                                    morning === "available"
                                      ? styles.slotAvailable
                                      : styles.slotReserved
                                  }`}
                                  aria-label={`Turno 1: ${statusText(morning)}`}
                                >
                                  <span aria-hidden="true">
                                    {statusIcon(morning)}
                                  </span>
                                  <span className={styles.slotLabel}>
                                    {statusText(morning)}
                                  </span>
                                </div>
                                <div
                                  className={`${styles.slotPill} ${
                                    afternoon === "available"
                                      ? styles.slotAvailable
                                      : styles.slotReserved
                                  }`}
                                  aria-label={`Turno 2: ${statusText(
                                    afternoon
                                  )}`}
                                >
                                  <span aria-hidden="true">
                                    {statusIcon(afternoon)}
                                  </span>
                                  <span className={styles.slotLabel}>
                                    {statusText(afternoon)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </FadeInSection>
          )}

          {activeSection === "photos" && (
            <FadeInSection>
              <PhotosSection
                collections={photosCollections}
                selectedCollectionId={photosCollectionId}
                onSelectCollection={setPhotosCollectionId}
                resetToken={photosResetToken}
                itemsByCollection={photosItemsByCollection}
                isLoading={photosLoading}
                error={photosError}
              />
            </FadeInSection>
          )}

          {activeSection === "transportation-fee" && (
            <FadeInSection>
              <MapSection resetToken={mapResetToken} />
            </FadeInSection>
          )}
        </Col>
      </Row>
    </div>
  );
};

CalendarPage.getLayout = (page: ReactElement) => {
  return <NonLayout>{page}</NonLayout>;
};

export default CalendarPage;
