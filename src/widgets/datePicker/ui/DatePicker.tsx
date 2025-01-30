import { useState } from "react";
import calendarIcon from "@shared/assets/images/calendar/calendar.svg";
import BottomSheet from "@shared/ui/bottomSheet/BottomSheet";
import styles from "./DatePicker.module.scss";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
}

interface CalendarDay {
  day: number | null;
  isCurrentMonth: boolean;
}

const DatePicker = ({ value = '', onChange, className }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [tempSelectedDate, setTempSelectedDate] = useState<number | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: CalendarDay[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let i = 0; i < remainingDays; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    return days;
  };

  const handleMonthChange = (change: number) => {
    setCurrentMonth(currentMonth + change);
    if (currentMonth + change > 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else if (currentMonth + change < 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    }
  };

  const handleDateSelect = (day: number) => {
    setTempSelectedDate(day);
  };

  const handleConfirm = () => {
    if (tempSelectedDate) {
      const formattedDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(tempSelectedDate).padStart(2, "0")}`;
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        className={`${styles.inputContainer} ${className || ''}`}
        onClick={() => setIsOpen(true)}
      >
        <input
          type="text"
          value={value}
          readOnly
          className={`${styles.dateInput} ${className || ''}`}
          placeholder="방문하신 날짜를 선택해주세요."
        />
        <img src={calendarIcon} className={styles.calendarIcon} alt="달력" />
      </div>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className={styles.bottomSheetContent}>
          <div className={styles.calendarHeader}>
            <button onClick={() => handleMonthChange(-1)}>&lt;</button>
            <h2>
              {currentYear}년 {currentMonth}월
            </h2>
            <button onClick={() => handleMonthChange(1)}>&gt;</button>
          </div>
          <div className={styles.calendar}>
            <div className={styles.weekdays}>
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div key={day} className={styles.weekday}>
                  {day}
                </div>
              ))}
            </div>
            <div className={styles.days}>
              {generateCalendarDays().map((dateObj, index) => (
                <button
                  key={index}
                  className={`${styles.day} 
                    ${tempSelectedDate === dateObj.day && dateObj.isCurrentMonth ? styles.selected : ""} 
                    ${!dateObj.isCurrentMonth ? styles.empty : ""}`}
                  onClick={() =>
                    dateObj.isCurrentMonth &&
                    dateObj.day &&
                    handleDateSelect(dateObj.day)
                  }
                  disabled={!dateObj.isCurrentMonth || !dateObj.day}
                >
                  {dateObj.day || ""}
                </button>
              ))}
            </div>
            <button
              className={styles.confirmButton}
              onClick={handleConfirm}
              disabled={!tempSelectedDate}
            >
              완료
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default DatePicker;
