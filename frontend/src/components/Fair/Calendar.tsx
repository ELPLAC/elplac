import React, { useState, useEffect } from "react";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFair } from "@/context/FairProvider";
import { CalendarProps } from "@/types";

export const Calendar: React.FC<CalendarProps> = ({ fairDays = [] }) => {
  const [dateSelect, setDate] = useState<Date | null>(null);
  const { setDateSelect } = useFair();
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (fairDays.length > 0) {
      const availableDates = fairDays
        .filter((day) => !day.isClosed) 
        .map((day) => {
          const date = new Date(day.day);
          date.setHours(date.getHours() + 3);
          return date;
        });

      setHighlightedDates(availableDates);
    }
  }, [fairDays]);

  const onChange = (date: Date | null) => {
    if (date) {
      const isValidDate = highlightedDates.some(
        (highlightedDate) => highlightedDate.toDateString() === date.toDateString()
      );

      if (isValidDate) {
        setDate(date); 
        setDateSelect(date); 
        setError(""); 
      } else {
        setError("La fecha seleccionada no está disponible.");
      }
    }
  };

  return (
    <div className="flex flex-col mt-5">
      <label className="font-bold">Fecha</label>
      <Datepicker
        selected={dateSelect}
        onChange={onChange}
        minDate={new Date()} 
        filterDate={(date) =>
          highlightedDates.some((highlightedDate) => highlightedDate.toDateString() === date.toDateString())
        }
        className="flex items-center text-sm sm:text-base justify-between w-fit sm:w-48 p-2 rounded-md bg-secondary-lighter placeholder:text-primary-dark text-primary-dark shadow-md cursor-pointer"
        calendarClassName="rounded-lg shadow-md relative z-20 cursor-pointer"
        dateFormat="dd/MM/yyyy"
        highlightDates={highlightedDates}
        shouldCloseOnSelect={true}
        focusSelectedMonth={true}
        placeholderText="Selecciona una fecha 🗓"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Calendar;
