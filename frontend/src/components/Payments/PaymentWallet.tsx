import React from "react";
import { Wallet } from "@mercadopago/sdk-react";

interface PaymentWalletProps {
  preferenceId: string;
}

const PaymentWallet: React.FC<PaymentWalletProps> = ({ preferenceId }) => {
  return <Wallet initialization={{ preferenceId }} />;
};

export default PaymentWallet;
