"use client";

import React from "react";
import { printLabelStyles } from "../styles/PrintLabel.styles";

type PrintButtonProps = {
    onClick: () => void;
    isDisabled: boolean;
}

const PrintButton: React.FC<PrintButtonProps> = ({ onClick, isDisabled }) => {
    return (
      <button
        className={`${printLabelStyles.buttonPrimary} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onClick}
        disabled={isDisabled}
      >
        Imprimir Etiquetas
      </button>
    );
  };

export default PrintButton;
