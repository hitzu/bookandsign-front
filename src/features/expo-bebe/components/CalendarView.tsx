import { useEffect, useMemo, useState } from "react";
import styles from "@assets/css/expo-bebe.module.css";
import {
  CalendarSlotsByMonthResponse,
  SlotAvailabilityStatus,
} from "../../../interfaces";
import { getSlotsByMonthAndYear } from "../../../api/services/slotsService";
import { YEARS } from "../data/serviceCatalog";
import { MONTHS, buildWeekendRows, toYMD } from "../utils/calendar";
import { IconChevronLeft, IconChevronRight } from "./Icons";

export function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIdx, setMonthIdx] = useState(today.getMonth());
  const [monthData, setMonthData] = useState<CalendarSlotsByMonthResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSlotsByMonthAndYear(monthIdx + 1, year);
        if (!cancelled) setMonthData(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError("No se pudo cargar la disponibilidad.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, [year, monthIdx]);

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

  const goPrev = () => {
    if (monthIdx === 0) {
      const prevYear = year - 1;
      if (prevYear >= YEARS[0]) {
        setYear(prevYear);
        setMonthIdx(11);
      }
    } else {
      setMonthIdx(monthIdx - 1);
    }
  };

  const goNext = () => {
    if (monthIdx === 11) {
      const nextYear = year + 1;
      if (nextYear <= YEARS[YEARS.length - 1]) {
        setYear(nextYear);
        setMonthIdx(0);
      }
    } else {
      setMonthIdx(monthIdx + 1);
    }
  };

  const isAtStart = year === YEARS[0] && monthIdx === 0;
  const isAtEnd = year === YEARS[YEARS.length - 1] && monthIdx === 11;

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
            onClick={() => setYear(y)}
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
          onChange={(e) => setMonthIdx(Number(e.target.value))}
          aria-label="Seleccionar mes"
        >
          {MONTHS.map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>

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
        <>
          <div className={styles.calHead}>
            {["Viernes", "Sábado", "Domingo"].map((d) => (
              <div key={d} className={styles.calHeadCell}>
                {d}
              </div>
            ))}
          </div>

          <div className={styles.calGrid}>
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
                      <div
                        className={`${styles.slot} ${getSlotClass(morning)}`}
                      >
                        <span
                          className={`${styles.slotMark} ${getMarkClass(morning)}`}
                        >
                          {slotIcon(morning)}
                        </span>
                        <span className={styles.slotLabel}>
                          {slotText(morning)}
                        </span>
                        <span className={styles.slotTime}>AM</span>
                      </div>
                      <div
                        className={`${styles.slot} ${getSlotClass(afternoon)}`}
                      >
                        <span
                          className={`${styles.slotMark} ${getMarkClass(afternoon)}`}
                        >
                          {slotIcon(afternoon)}
                        </span>
                        <span className={styles.slotLabel}>
                          {slotText(afternoon)}
                        </span>
                        <span className={styles.slotTime}>PM</span>
                      </div>
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
        </>
      )}
    </section>
  );
}
