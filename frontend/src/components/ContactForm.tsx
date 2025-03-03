import React, { useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./Notifications/Notifications";
import { URL } from "../../envs";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      notify("ToastError", "Por favor ingrese un correo electrónico válido");
      return;
    }

    const formData = {
      name,
      email,
      subject,
      message,
    };

    try {
      const response = await axios.post(`${URL}/users/contact`, formData);

      if (response) {
        notify(
          "ToastSuccess",
          "Gracias por contactarnos. Hemos recibido tu mensaje."
        );
      }
    } catch (error) {
      notify("ToastError", "Todos los campos deben estar completos.");
    }

    setName("");
    setSubject("");
    setMessage("");
    setEmail("");
  };

  return (
    <div className="flex flex-col items-end mt-4">
      <div className="bg-primary-light p-4 sm:p-8 rounded-lg shadow-lg sm:w-full sm:max-w-md w-3/4 sm:h-full">
        <form onSubmit={handleSubmit} className="space-y-4 text-center">
          <input
            type="text"
            placeholder="Nombre y apellido"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-full bg-primary-lighter rounded-lg border border-primary-default p-2"
          />

          <input
            type="text"
            placeholder="Asunto"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-full bg-primary-lighter rounded-lg border border-primary-default p-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-full bg-primary-lighter rounded-lg border border-primary-default p-2"
          />

          <textarea
            placeholder="Escriba su mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full sm:h-36 bg-primary-lighter rounded-lg border border-primary-default p-2"
          />

          <button
            type="submit"
            className="sm:w-64 px-4 py-2 bg-primary-default text-white rounded-lg"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
