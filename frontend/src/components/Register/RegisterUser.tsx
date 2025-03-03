"use client";

import { postUserRegister } from "@/helpers/services";
import { formTypeEnum, IUser } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { notify } from "../Notifications/Notifications";
import { useFormik } from "formik";
import { registerUserValidations } from "@/helpers/validations";
import Input from "../Input";
import { Checkbox, Label } from "flowbite-react";

const RegisterUser: React.FC = () => {
  const router = useRouter();

  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const signUp = async (user: IUser) => {
    const filteredParsedUser: Partial<IUser> = Object.fromEntries(
      Object.entries(user).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );

    try {
      setLoading(true);
      const res = await postUserRegister(filteredParsedUser);
      if (res?.ok) {
        formikUser.resetForm();
        router.push("/login");
        notify(
          "ToastSuccess",
          "Revisa tu casilla de correo para confirmar tu cuenta"
        );
        setLoading(false);
      } else {
        setLoading(false);
        throw new Error("Error en el registro");
      }
    } catch (error: any) {
      setLoading(false);
      notify("ToastError", error.message);
    }
  };

  const formikUser = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      dni: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: signUp,
    validate: registerUserValidations,
  });

  const getPropsUser = (name: string) => {
    return {
      name: name,
      userType: false,
      formType: formTypeEnum.login,
      onChange: formikUser.handleChange,
      onBlur: formikUser.handleBlur,
      value: formikUser.values[name as keyof IUser],
      touched: formikUser.touched[name as keyof IUser],
      errors: formikUser.errors[name as keyof IUser],
    };
  };

  return (
    <form onSubmit={formikUser.handleSubmit}>
      <div className="flex gap-4">
        <div className="mb-6 relative flex flex-col">
          <Input
            label="Nombre"
            type="text"
            placeholder="Juan"
            {...getPropsUser("name")}
          />
        </div>
        <div className="mb-6 relative flex flex-col">
          <Input
            label="Apellido"
            type="text"
            placeholder="Gomez"
            {...getPropsUser("lastname")}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="mb-6 relative flex flex-col">
          <Input
            label="DNI"
            type="text"
            placeholder="40500300"
            {...getPropsUser("dni")}
          />
        </div>
        <div className="mb-6 relative flex flex-col">
          <Input
            label="Email"
            type="email"
            placeholder="juangomez@gmail.com"
            {...getPropsUser("email")}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="mb-6 relative flex flex-col">
          <Input
            label="Contraseña"
            type="password"
            placeholder="********"
            {...getPropsUser("password")}
          />
        </div>
        <div className="mb-6 relative flex flex-col">
          <Input
            label="Repetir contraseña"
            type="password"
            placeholder="********"
            {...getPropsUser("confirmPassword")}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="accept"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <Label>
          <span className={` ${"text-secondary-darker"}`}>Acepto los </span>
          <a
            href="/terms&conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-dark hover:underline"
          >
            Términos y Condiciones
          </a>
        </Label>
      </div>
      <div className="flex justify-center">
        <button
          className={`
      bg-secondary-darker
      w-32 h-9 my-6 rounded-3xl text-center text-white text-base font-bold
      ${
        !isChecked || !formikUser.isValid ? "opacity-50 cursor-not-allowed" : ""
      }
    `}
          type="submit"
          disabled={!isChecked || !formikUser.isValid}
        >
          Registrarse
        </button>
        {isLoading && (
          <svg
            version="1.1"
            id="loader-1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="40px"
            height="40px"
            viewBox="0 0 50 50"
            xmlSpace="preserve"
            className="animate-spin"
          >
            <path
              fill="#FFD47B"
              d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
            />
          </svg>
        )}
      </div>
    </form>
  );
};

export default RegisterUser;
