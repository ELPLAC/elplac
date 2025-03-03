"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./Notifications/Notifications";
import { URL } from "../../envs";

export const Suscribe = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleErrors = (status: number, message: string) => {
    switch (status) {
      case 400:
        notify("ToastError", "Por favor, introduce un correo electrónico válido.");
        break;
      case 409:
        notify("ToastError", "El correo ya está suscrito al Newsletter.");
        break;
      case 500:
        notify("ToastError", "Error al procesar la suscripción. Inténtalo más tarde.");
        break;
      default:
        notify("ToastError", message || "Ocurrió un error inesperado.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      notify("ToastError", "Por favor, introduce un correo electrónico válido.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${URL}/users/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        notify("ToastSuccess", "¡Gracias por suscribirte a nuestro Newsletter!");
      } else {
        const errorData = await response.json();
        handleErrors(response.status, errorData.message);
      }
    } catch (error) {
      notify("ToastError", "Hubo un problema con el servidor. Inténtalo más tarde.");
    } finally {
      setIsLoading(false);
      setEmail("");
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row w-full justify-around items-center p-4 sm:p-12"
      style={{ backgroundColor: "#def5f6" }}
    >
      <div className="flex flex-col justify-center items-center text-center mb-4 md:mb-0">
        <div className="text-primary-darker font-semibold">
          ¡Suscribite a nuestro Newsletter y{" "}
        </div>
        <div className="text-primary-darker font-semibold">
          enterate primero de las próximas ferias!
        </div>
      </div>

      <div className="flex flex-col">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sm:w-64 sm:h-12 w-32 h-8 rounded-lg border border-primary-default p-2"
            style={{
              border: "2px solid #2f8083",
            }}
            disabled={isLoading}
          />

          <button
            type="submit"
            className="ml-4 px-3 py-2 bg-primary-default text-white rounded-lg text-xs sm:text-base"
            style={{ backgroundColor: "#2f8083" }}
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
};
