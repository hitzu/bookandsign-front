import { Col, Row } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { FadeInSection } from "./FadeInSection";
import styles from "../../assets/css/calendar.module.css";
import {
  CalendarSlotsByMonthResponse,
  SlotAvailabilityStatus,
} from "../../interfaces";
import { getSlotsByMonthAndYear } from "../../api/services/slotsService";

const currentDate = new Date();
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

type WeekendKey = "fri" | "sat" | "sun";
type WeekendWeekRow = {
  key: string; // YYYY-MM-DD (monday of that week)
  days: Partial<Record<WeekendKey, Date>>;
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

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const CalendarSection = () => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [monthData, setMonthData] = useState<CalendarSlotsByMonthResponse[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
  };

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

  const getStatus = (
    ymd: string,
    slot: "morning" | "afternoon"
  ): SlotAvailabilityStatus => {
    return availabilityByDate.get(ymd)?.[slot] ?? "available";
  };

  return (
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
            <div className={styles.loadHint}>Cargando disponibilidad…</div>
          )}

          <div className={styles.weekendGridHeader}>
            {["Viernes", "Sábado", "Domingo"].map((k) => (
              <div key={k} className={styles.weekendHeaderCell}>
                {k}
              </div>
            ))}
          </div>

          <div className={styles.weekendGrid}>
            {weekendWeeks.map((week) => (
              <div key={week.key} className={styles.weekRow}>
                {(["fri", "sat", "sun"] as WeekendKey[]).map((k) => {
                  const d = week.days[k];
                  if (!d) {
                    return <div key={k} className={styles.dayCellEmpty} />;
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
                          <span aria-hidden="true">{statusIcon(morning)}</span>
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
                          aria-label={`Turno 2: ${statusText(afternoon)}`}
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
  );
};
