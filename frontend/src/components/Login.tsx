"use client";
import { useFormik } from "formik";
import { postUserLogin } from "@/helpers/services";
import { IUserLogin, formTypeEnum } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { loginValidations } from "@/helpers/validations";
import Input from "./Input";
import Image from "next/image";
import profile from "@/assets/profile.svg";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./Notifications/Notifications";
import { useAuth } from "@/context/AuthProvider";
import ForgotPass from "./ForgotPass";
import { decodeJWT } from "@/helpers/decoder";

export const Login = () => {
  const router = useRouter();
  const { setToken, token, setRoleAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const signIn = async (user: IUserLogin & { rememberMe: boolean }) => {
    setIsLoading(true);
    try {
      const res = await postUserLogin(user);
  
      if (user.rememberMe) {
        localStorage.setItem("token", res.token);
        setToken(res.token);
      }
  
      localStorage.setItem("token", res.token);
      setToken(res.token);
      localStorage.setItem("role", res.role);
      setRoleAuth(res.role);
      const decoded = decodeJWT(res.token);
  
      formik.resetForm();
      notify("ToastSuccess", "¡Sesión iniciada!");
  
      if (decoded && decoded.role === "admin") {
        router.push("/admin");
      } else if (decoded && (decoded.role === "user" || decoded.role === "seller")) {
        router.push("/dashboard");
      }
    } catch (error: any) {
    
      const errorMessage = error.message || "Datos Incorrectos";
    
      if (errorMessage === "Usuario inexistente") {
        notify("ToastError", "El usuario no existe");
      } else if (errorMessage === "Debes confirmar tu cuenta") {
        notify("ToastWarning", "Debes confirmar tu cuenta antes de iniciar sesión");
      } else {
        notify("ToastError", "Datos Incorrectos");
      }
    }
    finally {
      setIsLoading(false);
    }
  };
  

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: signIn,
    validate: loginValidations,
  });

  const getProps = (name: string) => {
    return {
      name: name,
      formType: formTypeEnum.login,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      value: formik.values[name as keyof IUserLogin],
      touched: formik.touched[name as keyof IUserLogin],
      errors: formik.errors[name as keyof IUserLogin],
    };
  };

  useEffect(() => {
    if (typeof window !== "undefined" && token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        if (decoded.role === "admin") {
          router.push("/admin");
        } else if (decoded.role === "user" || decoded.role === "seller") {
          router.push("/dashboard");
        }
      }
    }
  }, [token, router]);

  return (
    <div className="grow-down">
      <div className="relative h-max -translate-y-20 p-10  bg-white  rounded-[30px] shadow-lg mt-6">
        <div className="w-full text-center mb-6">
          <h1 className="text-secondary-darker mb-3 font-bold text-lg leading-relaxed">
            INICIAR SESION
          </h1>
          <div className="border border-secondary-darker w-[75%] m-auto mb-5"></div>
        </div>
        <button
          type="button"
          className="hidden lg:inline-block px-6 py-20 z-0 cursor-default bg-white rounded-tr-3xl rounded-br-3xl absolute right-0 translate-x-[99%] shadow-customRight"
        >
          <p className="absolute font-medium left-[120%] text-secondary-darker">
            #Ingresá
          </p>
          <Image src={profile} alt="Icono de perfil" />
        </button>
        <form onSubmit={formik.handleSubmit} className="loginFormContent">
          <div className="mb-6 relative flex flex-col">
            <Input
              label="Email"
              type="email"
              placeholder="Juan"
              {...getProps("email")}
            />
          </div>
          <div className="mb-6 relative flex flex-col">
            <Input
              label="Password"
              type="password"
              placeholder="******"
              {...getProps("password")}
            />
          </div>
          <div className="mb-0 relative flex gap-2 items-center text-secondary-darker text-base font-medium">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <label>Mantener sesión iniciada</label>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-secondary-darker w-32 h-9 my-6 rounded-3xl text-center text-white text-base font-bold cursor-pointer"
              type="submit"
              disabled={!formik.isValid || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                </div>
              ) : (
                "Ingresar"
              )}
            </button>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="font-semibold text-secondary-darker text-center"
          >
            Olvidé mi contraseña
          </button>
        </form>
      </div>
      {openModal && (
        <div>
          <ForgotPass onCloseModal={() => setOpenModal(false)} message="" />
        </div>
      )}
    </div>
  );
};
