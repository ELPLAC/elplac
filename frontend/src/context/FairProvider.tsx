"use client";
import { getFair } from "@/helpers/services";
import { URL } from "@/envs"; // O la ruta correcta donde tengas envs.ts (ej: "@/envs")
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
  const [activeFair, setActiveFair] = useState<IFair | undefined>(undefined);

  useEffect(() => {
    const fetchFair = async () => {
      try {
        const res = await getFair();
        
        // Proteccion estricta contra respuestas nulas/undefined
        const safeFairs: IFair[] = Array.isArray(res) ? res : [];
        setFairs(safeFairs);

        // Busqueda segura de feria activa
        const active = safeFairs.find((fair: IFair) => fair?.isActive === true);

        if (active?.id) {
          try {
            // Usa la constante URL de envs.ts (https://elplac-production-3a9f.up.railway.app)
            const response = await fetch(`${URL}/fairs/${active.id}`);
            
            if (response.ok) {
              const fullActiveFair: IFair = await response.json();
              setActiveFair(fullActiveFair);
            } else {
              setActiveFair(active);
            }
          } catch {
            setActiveFair(active);
          }
        } else {
          setActiveFair(undefined);
        }
      } catch (error) {
        console.error("Error al obtener las ferias:", error);
        setFairs([]);
        setActiveFair(undefined);
      }
    };

    fetchFair();
  }, []);

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
      }}
    >
      {children}
    </FairContext.Provider>
  );
};

export const useFair = () => {
  const context = useContext(FairContext);
  if (!context) {
    throw new Error("useFair must be used within a FairContext");
  }
  return context;
};