import { useFair } from "@/context/FairProvider";
import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import { IFair, FairDay, BuyerCapacity } from "@/types";

const compareDates = (date1: Date, date2: Date) => {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
};

function TimeRange() {
  const { fairs, dateSelect, setTimeSelect } = useFair();
  const [schedulesTurns, setSchedulesTurns] = useState<BuyerCapacity[]>([]);

  useEffect(() => {
    if (fairs && dateSelect) {
      const selectedFair = fairs.find((f: IFair) =>
        f.fairDays.some(
          (day: FairDay) => compareDates(new Date(day.day), dateSelect)
        )
      );

      if (selectedFair) {
        const fairDay = selectedFair.fairDays.find(
          (day: FairDay) => compareDates(new Date(day.day), dateSelect)
        );

        if (fairDay) {
          setSchedulesTurns(fairDay.buyerCapacities); 
        }
      }
    }
  }, [fairs, dateSelect]);

  useEffect(() => {
  }, [schedulesTurns]);

  const [horarioSeleccionado, setHorarioSeleccionado] = useState<string>("");

  const options = [...schedulesTurns].reverse().map((hc) => ({
    id: hc.hour,
    name: `${
      hc.capacity === 0
        ? "Agotado"
        : `${hc.hour}hs: disponibles (${hc.capacity})`
    }`,
  }));

  const handleHorarioSelect = (option: { id: string; name: string }) => {
    const selectedHorario = schedulesTurns.find((hc) => hc.hour === option.id);
    if (selectedHorario && selectedHorario.capacity > 0) {
      setHorarioSeleccionado(option.id);
      setTimeSelect(option.id); 
    }
  };

  return (
    <div className="flex flex-col mt-5">
      <label className="font-bold">Horario</label>
      <Dropdown
        options={options}
        onSelect={handleHorarioSelect}
        value={horarioSeleccionado || "Selecciona Horario"}
        className="w-48"
      />
    </div>
  );
}

export default TimeRange;
