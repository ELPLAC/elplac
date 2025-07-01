"use client";
import { getFair } from "@/helpers/services";
import {
  IFair,
  IFairContext,
  IFairProviderProps,
} from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const FairContext = createContext<IFairContext | undefined>(undefined);

export const FairProvider = ({ children }: IFairProviderProps): JSX.Element => {
  const [fairs, setFairs] = useState<IFair[]>([]);
  const [fairSelected, setFairSelected] = useState<any>(null);
  const [dateSelect, setDateSelect] = useState<Date | null>(null);
  const [timeSelect, setTimeSelect] = useState<string>("");
  const [activeFair, setActiveFair] = useState<IFair | undefined>(undefined);

  const pastFairs = fairs.filter((fair: IFair) => fair.isActive === false);

  useEffect(() => {
    const fetchFair = async () => {
      try {
        const res: IFair[] = await getFair();
        if (Array.isArray(res)) {
          setFairs(res);
          setActiveFair(res.find((fair: IFair) => fair.isActive === true));
        }
      } catch (error) {
        console.error("Error fetching fairs", error);
      }
    };
    fetchFair();
  }, []);

  return (
    <FairContext.Provider
      value={{
        fairs,
        activeFair,
        pastFairs,
        setActiveFair,
        setDateSelect,
        setTimeSelect,
        timeSelect,
        dateSelect,
        fairSelected,
        setFairSelected,
      }}>
      {children}
    </FairContext.Provider>
  );
};

export const useFair = () => {
  const context = useContext(FairContext);
  if (!context) {
    throw new Error("useAuth must be used within an FairContext");
  }
  return context;
};