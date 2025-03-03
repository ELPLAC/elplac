"use client";
import React, { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { PaymentsSellerProps } from "@/types"; 
import { URL, MERCADOPAGO_PUBLIC_KEY } from "../../../envs";

export default function PaymentsSeller({
  userId,
  fairId,
  categoryId,
  handleBuy,
  disabled,
  className,
  liquidation,
}: PaymentsSellerProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    initMercadoPago(`APP_USR-0d3eeaf4-5947-4873-bf75-3eb2d0c35672`, {
      locale: "es-AR",
    });
  }, []);


  const handlePayment = async (
    userId: string | undefined,
    fairId: string | undefined,
    categoryId: string | undefined,
    liquidation: string | undefined
  ) => {
    try {
      if (!userId || !fairId || !categoryId) {
        throw new Error("Missing parameters");
      }


      const response = await fetch(`${URL}/payments/createPreferenceSeller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          fairId,
          categoryId,
          liquidation,
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!text) {
        throw new Error("Empty response");
      }

      try {
        const data = JSON.parse(text);
        return data;
      } catch (parseError) {
        throw new Error("Error parsing JSON: " + (parseError as Error).message);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const handleClick = async () => {
    try {
      const preference = await handlePayment(userId, fairId, categoryId, liquidation);

      if (preference && preference.preferenceId) {
        setPreferenceId(preference.preferenceId);
        if (preferenceId) {
          handleBuy();  
        }
      } else {
        throw new Error("Invalid preference response");
      }
    } catch (error: any) {
    }
  };
  

  return (
    <div>
      <button onClick={handleClick} className={className} disabled={disabled}>
        Generar botón de Mercado Pago
      </button>
      {preferenceId && <Wallet initialization={{ preferenceId }} />}
    </div>
  );
}
