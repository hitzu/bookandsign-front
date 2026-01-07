import React, { ReactElement, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import NonLayout from "@layout/NonLayout";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import logoWhite from "@assets/images/logo-white.png";
import styles from "../../assets/css/calendar.module.css";
import Image from "next/image";
import { Row, Col, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import SlotsChips from "@common/slots/slots-chips";
import { GetSlotResponse } from "../../interfaces";
import { formatLongSpanishDate } from "@common/dates";
import {
  getSlots,
  holdSlot,
  cancelHoldSlot,
} from "../../api/services/slotsService";
import { createNote } from "src/api/services/notesService";

const CalendarPage = () => {
  const router = useRouter();
  const currentDate = new Date();
  const [date, setDate] = useState<Date | null>(currentDate);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<{
    utc: string;
    ymd: string;
  } | null>(null);
  const [slots, setSlots] = useState<GetSlotResponse[]>([]);
  const [reservation, setReservation] = useState<{
    period: string;
    label: string;
  } | null>(null);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate({
      utc: date.toISOString(),
      ymd: `${date?.getFullYear()}-${String(date?.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date?.getDate()).padStart(2, "0")}`,
    });
  };

  useEffect(() => {
    if (!router.isReady) return;

    const q = router.query.date;
    const dateStr = Array.isArray(q) ? q[0] : q;
    if (!dateStr) return;

    // expects /pages/calendar?date=YYYY-MM-DD
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (!m) return;

    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])); // local date
    setDate(d);
    setSelectedYear(d.getFullYear());
    setSelectedMonth(d.getMonth());
    handleDateSelect(d); // this makes selectedDate non-null => opens slot selection UI
  }, [router.isReady, router.query.date]);

  const handleLogoClick = () => {
    router.push("/");
  };

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
  const timeSlots = useMemo(
    () => [
      { value: "morning", label: "Mañana" },
      { value: "afternoon", label: "Tarde" },
      { value: "evening", label: "Noche" },
    ],
    []
  );

  const refreshSlots = async (ymd?: string) => {
    const ymdToUse = ymd ?? selectedDate?.ymd;
    if (!ymdToUse) return;
    const next = await getSlots(ymdToUse);
    setSlots(next);
  };

  useEffect(() => {
    if (!selectedDate?.ymd) return;
    refreshSlots(selectedDate.ymd);
  }, [selectedDate]);

  const openProspectForm = (period: string) => {
    const label = timeSlots.find((t) => t.value === period)?.label ?? period;
    setReservation({ period, label });
    setSubmitError(null);
  };

  const closeProspectForm = () => {
    setReservation(null);
    setLeadName("");
    setLeadEmail("");
    setLeadPhone("");
    setNotes("");
    setSubmitError(null);
    setIsSubmitting(false);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    if (date) {
      const newDate = new Date(date);
      newDate.setFullYear(year);
      setDate(newDate);
    }
  };

  const handleMonthChange = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    const newDate = new Date(selectedYear, monthIndex, 1);
    setDate(newDate);
  };

  const handleSlotClick = async ({
    status,
    period,
    slotId,
  }: {
    status: string;
    period: string;
    slotId?: number;
  }) => {
    if (status === "available") {
      openProspectForm(period);
      return;
    } else if (status === "held") {
      if (!slotId) return;
      router.push(`/pages/contract-creation/${slotId}`);
    }
  };

  const handleCancelHold = async (slotId: number) => {
    try {
      await cancelHoldSlot(slotId);
      await refreshSlots();
    } catch (e) {
      console.error("Error canceling slot:", e);
    }
  };

  const submitHold = async () => {
    if (!selectedDate?.utc) return;

    const name = leadName.trim();
    if (!name) {
      setSubmitError("El nombre del cliente es obligatorio.");
      return;
    }

    if (!reservation?.period) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const slot = await holdSlot({
        eventDate: selectedDate.ymd,
        period: reservation.period,
        leadName: name,
        leadEmail: leadEmail.trim() ? leadEmail.trim() : null,
        leadPhone: leadPhone.trim() ? leadPhone.trim() : null,
      });

      if (notes) {
        await createNote({
          targetId: slot.id,
          content: notes,
          scope: "slot",
          kind: "internal",
        });
      }

      await refreshSlots();
      closeProspectForm();
    } catch (e) {
      setSubmitError("No se pudo apartar el slot. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <Row className="justify-content-center">
        <Col>
          <Row className="mb-4">
            <Col className="text-center">
              <div
                onClick={handleLogoClick}
                style={{
                  cursor: "pointer",
                  display: "inline-block",
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Image src={logoWhite} alt="logo" width={100} height={100} />
              </div>
            </Col>
          </Row>
          {/* showing calendar */}
          {!selectedDate && (
            <Row className="g-2 justify-content-center">
              <Col xs={12}>
                <h1 className={styles.title}>Selecciona una fecha</h1>
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

              {/* Calendar */}
              <Col xs={12}>
                <div className={styles.calendarWrapper}>
                  <Calendar
                    value={date}
                    onChange={(value) => {
                      const newDate = value as Date;
                      setDate(newDate);
                      handleDateSelect(newDate);
                    }}
                    activeStartDate={new Date(selectedYear, selectedMonth, 1)}
                    view="month"
                    showNavigation={false}
                    className={styles.customCalendar}
                    locale="es"
                  />
                </div>
              </Col>
            </Row>
          )}
          {selectedDate && (
            <Row className="justify-content-center">
              <Col xs={12} lg={8} xl={5} className={styles.availabilityStack}>
                <div className={styles.title_availability}>
                  <h1 className={styles.title}>
                    Disponibilidad para el{" "}
                    {selectedDate
                      ? formatLongSpanishDate(new Date(selectedDate.utc))
                      : ""}
                  </h1>
                </div>

                <div className={styles.slotsStack}>
                  {timeSlots.map((timeSlot) => {
                    const periodSlot = slots.find(
                      (slot) => slot.period === timeSlot.value
                    );
                    const status = periodSlot?.slot?.status ?? "available";
                    return (
                      <SlotsChips
                        key={`${selectedDate?.ymd}-${timeSlot.value}-${status}`}
                        timeSlot={timeSlot}
                        status={status}
                        slot={periodSlot}
                        handleClick={handleSlotClick}
                        handleCancelHold={handleCancelHold}
                      />
                    );
                  })}
                </div>

                {/* FORMULARIO (se muestra al click en slot disponible o botón Apartar) */}
                {reservation && (
                  <div className={styles.reservationCard}>
                    <div className={styles.reservationTitle}>
                      Apartar slot - {reservation.label.toLowerCase()}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Nombre del cliente{" "}
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.formInput}
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Ana López"
                        autoFocus
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Teléfono (opcional)
                      </label>
                      <input
                        className={styles.formInput}
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="222110149"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Email (opcional)
                      </label>
                      <input
                        className={styles.formInput}
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="ana@email.com"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Notas</label>
                      <textarea
                        className={styles.formTextarea}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: Interesado en paquete Premium"
                        rows={3}
                      />
                    </div>

                    {submitError && (
                      <div className={styles.formError}>{submitError}</div>
                    )}

                    <div className={styles.formActions}>
                      <button
                        className={styles.btnCancel}
                        type="button"
                        onClick={closeProspectForm}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </button>

                      <button
                        className={styles.btnPrimary}
                        type="button"
                        onClick={submitHold}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Apartando..." : "Apartar slot"}
                      </button>
                    </div>
                  </div>
                )}

                <div className={styles.backRow}>
                  <Button
                    variant="primary"
                    className={styles.backButtonBig}
                    onClick={() => setSelectedDate(null)}
                  >
                    Mostrar Calendario
                  </Button>
                </div>
              </Col>
            </Row>
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
