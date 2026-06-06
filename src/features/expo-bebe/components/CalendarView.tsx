import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import styles from "@assets/css/expo-bebe.module.css";
import {
  CalendarSlotsByMonthResponse,
  SlotAvailabilityStatus,
} from "../../../interfaces";
import { getSlotsByMonthAndYear } from "../../../api/services/slotsService";
import { YEARS } from "../data/serviceCatalog";
import {
  ContractPeriod,
  MONTHS,
  SwipeDir,
  buildWeekendRows,
  detectSwipe,
  slotToPeriod,
  stepMonth,
  toYMD,
} from "../utils/calendar";
import { IconChevronLeft, IconChevronRight } from "./Icons";

interface CalendarViewProps {
  brandId: number;
  onPickSlot?: (date: string, period: ContractPeriod) => void;
}

export function CalendarView({ brandId, onPickSlot }: CalendarViewProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIdx, setMonthIdx] = useState(today.getMonth());
  const [monthData, setMonthData] = useState<CalendarSlotsByMonthResponse[]>(
    [],
  );
  const [monthHasReservedDate, setMonthHasReservedDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const [transitionDir, setTransitionDir] = useState<SwipeDir>(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSlotsByMonthAndYear(monthIdx + 1, year, brandId);
        if (!cancelled) {
          setMonthData(Array.isArray(data?.days) ? data.days : []);
          setMonthHasReservedDate(Boolean(data?.risk));
        }
      } catch {
        if (!cancelled) {
          setError("No se pudo cargar la disponibilidad.");
          setMonthHasReservedDate(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, [brandId, year, monthIdx]);

  const availMap = useMemo(() => {
    const map = new Map<
      string,
      { morning: SlotAvailabilityStatus; afternoon: SlotAvailabilityStatus }
    >();
    for (const d of monthData) map.set(d.date, d.slots);
    return map;
  }, [monthData]);

  const weekendRows = useMemo(
    () => buildWeekendRows(year, monthIdx),
    [year, monthIdx],
  );

  const getSlotClass = (status: SlotAvailabilityStatus) =>
    status === "available" ? styles.slotDisp : styles.slotOcup;
  const getMarkClass = (status: SlotAvailabilityStatus) =>
    status === "available" ? styles.slotMarkDisp : styles.slotMarkOcup;
  const slotText = (status: SlotAvailabilityStatus) =>
    status === "available" ? "Libre" : "Ocupado";
  const slotIcon = (status: SlotAvailabilityStatus) =>
    status === "available" ? "✓" : "×";

  const applyMonthChange = (nextYear: number, nextMonthIdx: number) => {
    if (nextYear === year && nextMonthIdx === monthIdx) return;

    const currentOrder = year * 12 + monthIdx;
    const nextOrder = nextYear * 12 + nextMonthIdx;

    setTransitionDir(nextOrder > currentOrder ? "next" : "prev");
    setYear(nextYear);
    setMonthIdx(nextMonthIdx);
  };

  const goPrev = () => {
    const nextState = stepMonth(
      year,
      monthIdx,
      "prev",
      YEARS[0],
      YEARS[YEARS.length - 1],
    );
    if (!nextState) return;
    applyMonthChange(nextState.year, nextState.monthIdx);
  };

  const goNext = () => {
    const nextState = stepMonth(
      year,
      monthIdx,
      "next",
      YEARS[0],
      YEARS[YEARS.length - 1],
    );
    if (!nextState) return;
    applyMonthChange(nextState.year, nextState.monthIdx);
  };

  const isAtStart = year === YEARS[0] && monthIdx === 0;
  const isAtEnd = year === YEARS[YEARS.length - 1] && monthIdx === 11;
  const calendarMotionClass =
    transitionDir === "prev"
      ? styles.calMotionPrev
      : transitionDir === "next"
        ? styles.calMotionNext
        : "";

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;

    if (startX == null) return;

    const endX = event.changedTouches[0]?.clientX;
    if (typeof endX !== "number") return;

    const direction = detectSwipe(endX - startX);
    if (direction === "prev") goPrev();
    if (direction === "next") goNext();
  };

  const renderSlot = (
    ymd: string,
    slot: "morning" | "afternoon",
    status: SlotAvailabilityStatus,
  ) => {
    const content = (
      <>
        <span className={`${styles.slotMark} ${getMarkClass(status)}`}>
          {slotIcon(status)}
        </span>
        <span className={styles.slotLabel}>{slotText(status)}</span>
        <span className={styles.slotTime}>{slot === "morning" ? "AM" : "PM"}</span>
      </>
    );

    const className = `${styles.slot} ${getSlotClass(status)}`;

    if (status !== "available") {
      return <div className={className}>{content}</div>;
    }

    return (
      <button
        type="button"
        className={`${className} ${styles.slotButton}`}
        onClick={() => onPickSlot?.(ymd, slotToPeriod(slot))}
        aria-label={`Seleccionar ${ymd} ${slot === "morning" ? "AM" : "PM"}`}
      >
        {content}
      </button>
    );
  };

  return (
    <section className={styles.panel}>
      {/* Decorative stickers — PNGs in /public/assets/expo-bebe/ */}
      {/* <img
        src="/assets/expo-bebe/sticker-elephant.png"
        alt=""
        className={styles.stickerTopLeft}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <img
        src="/assets/expo-bebe/sticker-bear-pink.png"
        alt=""
        className={styles.stickerTopRight}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      /> */}

      {/* <div className={styles.panelTitle}>
        Disponi<span className={styles.panelTitleAc}>bilidad</span>
      </div> */}

      {/* Year pills */}
      <div className={styles.yearRow}>
        {YEARS.map((y) => (
          <button
            key={y}
            className={`${styles.yearPill} ${y === year ? styles.yearPillActive : ""}`}
            onClick={() => applyMonthChange(y, monthIdx)}
            type="button"
          >
            {y}
          </button>
        ))}
      </div>

      {/* Month navigation */}
      <div className={styles.monthNav}>
        <button
          className={styles.monthArrow}
          onClick={goPrev}
          disabled={isAtStart}
          aria-label="Mes anterior"
          type="button"
        >
          <IconChevronLeft />
        </button>

        <select
          className={styles.monthSelect}
          value={monthIdx}
          onChange={(e) => applyMonthChange(year, Number(e.target.value))}
          aria-label="Seleccionar mes"
        >
          {MONTHS.map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>

        {monthHasReservedDate && (
          <span
            className={styles.riskDot}
            aria-label="Requiere validación"
            title="Requiere validación"
          />
        )}

        <button
          className={styles.monthArrow}
          onClick={goNext}
          disabled={isAtEnd}
          aria-label="Mes siguiente"
          type="button"
        >
          <IconChevronRight />
        </button>
      </div>

      {/* Grid */}
      {error && <div className={styles.calError}>{error}</div>}
      {loading && (
        <div className={styles.calLoading}>Cargando disponibilidad…</div>
      )}

      {!loading && (
        <div
          key={`${year}-${monthIdx}`}
          className={`${styles.calMotion} ${calendarMotionClass}`}
        >
          <div className={styles.calHead}>
            {["Viernes", "Sábado", "Domingo"].map((d) => (
              <div key={d} className={styles.calHeadCell}>
                {d}
              </div>
            ))}
          </div>

          <div
            className={styles.calGrid}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {weekendRows.map((row) =>
              ([row.fri, row.sat, row.sun] as (number | undefined)[]).map(
                (day, ci) => {
                  const dow = ci === 0 ? "fri" : ci === 1 ? "sat" : "sun";
                  if (!day)
                    return (
                      <div
                        key={`${row.key}-${dow}`}
                        className={styles.dayEmpty}
                      />
                    );

                  const ymd = toYMD(year, monthIdx, day);
                  const slots = availMap.get(ymd);
                  const morning: SlotAvailabilityStatus =
                    slots?.morning ?? "available";
                  const afternoon: SlotAvailabilityStatus =
                    slots?.afternoon ?? "available";
                  const isToday =
                    year === today.getFullYear() &&
                    monthIdx === today.getMonth() &&
                    day === today.getDate();

                  return (
                    <div
                      key={`${row.key}-${dow}`}
                      className={`${styles.day} ${isToday ? styles.dayToday : ""}`}
                    >
                      <div
                        className={`${styles.dayNum} ${isToday ? styles.dayNumToday : ""}`}
                      >
                        {day}
                      </div>
                      {renderSlot(ymd, "morning", morning)}
                      {renderSlot(ymd, "afternoon", afternoon)}
                    </div>
                  );
                },
              ),
            )}
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendDotDisp}`} />{" "}
              Disponible
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendDotOcup}`} />{" "}
              Ocupado
            </div>
            <div className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.legendDotToday}`}
              />{" "}
              Hoy
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
