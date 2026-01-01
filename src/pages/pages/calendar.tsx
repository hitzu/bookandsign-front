import React, { ReactElement, useState } from "react";
import Select from "react-select";
import NonLayout from "@layout/NonLayout";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import logoWhite from "@assets/images/logo-white.png";
import styles from "../../assets/css/calendar.module.css";
import Image from "next/image";
import { Row, Col } from "react-bootstrap";

const handleDateSelect = (date: Date) => {
  console.log(date);
};

const CalendarPage = () => {
  const currentDate = new Date();
  const [date, setDate] = useState<Date | null>(currentDate);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const years = [2025, 2026, 2027];
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
    // Actualizar el calendario con el nuevo mes
    const newDate = new Date(selectedYear, monthIndex, 1);
    setDate(newDate);
  };

  return (
    <div className={styles.calendarContainer}>
      <Row className="justify-content-center">
        <Col>
          {/* Logo Section */}
          <Row className="mb-4">
            <Col className="text-center">
              <Image src={logoWhite} alt="logo" width={100} height={100} />
            </Col>
          </Row>

          {/* Content Section */}
          <Row className="g-4 justify-content-center">
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
        </Col>
      </Row>
    </div>
  );
};

CalendarPage.getLayout = (page: ReactElement) => {
  return <NonLayout>{page}</NonLayout>;
};

export default CalendarPage;
