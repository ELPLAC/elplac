import React from "react";
import { handlePayment } from "./paymentUtils";

interface PaymentButtonProps {
  userId: string | undefined;
  fairId: string | undefined;
  categoryId: string | undefined;
  setPreferenceId: React.Dispatch<React.SetStateAction<string | null>>;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  userId,
  fairId,
  categoryId,
  setPreferenceId,
}) => {
  const handleClick = async () => {
    if (!userId || !fairId || !categoryId) {
      return;
    }

    try {
      const preference = await handlePayment(userId, fairId, categoryId);
      if (preference && preference.preferenceId) {
        setPreferenceId(preference.preferenceId);
      } else {
      }
    } catch (error: any) {
    }
  };

  return <button onClick={handleClick}>Crear Preferencia</button>;
};

export default PaymentButton;
