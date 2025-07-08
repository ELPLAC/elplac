"use client";
import { getFair } from "@/helpers/services";
import {
  IFair,
  IFairContext,
  IFairProviderProps,
} from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const FairContext = createContext<IFairContext | undefined>(undefined);

export const FairProvider: React.FC<IFairProviderProps> = ({ children }) => {
  const [fairs, setFairs] = useState<IFair[]>([]);
  const [fairSelected, setFairSelected] = useState<any>(null);
  const [dateSelect, setDateSelect] = useState<Date | null>(null);
  const [timeSelect, setTimeSelect] = useState<string>("");
  const [activeFair, setActiveFair] = useState<IFair | null | undefined>(undefined);

  useEffect(() => {
    const fetchFair = async () => {
      try {
        const res: IFair[] = await getFair();
        if (Array.isArray(res)) {
          setFairs(res);
          setActiveFair(res.find((fair: IFair) => fair.isActive === true));
        } else {
        }
      } catch (error) {
      }
    };
    fetchFair();
  }, [ ]);
  

  return (
    <FairContext.Provider
      value={{
        fairs,
        activeFair,
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
