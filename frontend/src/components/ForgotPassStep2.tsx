/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { resetPassword } from "@/helpers/services";
import React, { useEffect } from "react";
import { notify } from "./Notifications/Notifications";
import { useFormik } from "formik";
import { formTypeEnum, IForgotPasswordProps, IPasswordChangeForgot } from "@/types";
import { resetPasswordValidations } from "@/helpers/validations";
import Input from "./Input";
import { useRouter, useSearchParams } from "next/navigation";

const ForgotPassStep2: React.FC<IForgotPasswordProps> = ({ token }) => {
  const searchParams = useSearchParams();
  const router = useRouter();


  useEffect(() => {
    if (token) {
      formikPass.setFieldValue("token", token);
    }
  }, [searchParams]);

  const changePassword = async (values: IPasswordChangeForgot) => {
    const { token, newPassword, confirmNewPassword } = values;
    try {
      await resetPassword(token, newPassword, confirmNewPassword);
      formikPass.resetForm();
      notify("ToastSuccess", "¡Contraseña cambiada!");
      router.push("/login");
    } catch (error: any) {
      notify("ToastError", "Datos Incorrectos");
    }
  };

  const formikPass = useFormik({
    initialValues: {
      token: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: changePassword,
    validate: resetPasswordValidations,
  });

  const getProps = (name: string) => {
    return {
      name: name,
      formType: formTypeEnum.dashboard_user,
      onChange: formikPass.handleChange,
      onBlur: formikPass.handleBlur,
      value: formikPass.values[name as keyof IPasswordChangeForgot],
      touched: formikPass.touched[name as keyof IPasswordChangeForgot],
      errors: formikPass.errors[name as keyof IPasswordChangeForgot],
      label: name,
    };
  };

  const getPropsWithLabel = (name: string, label: string) => {
    const props = getProps(name);
    return {
      ...props,
      label,
    };
  };

  return (
    <div className="flex bg-secondary-light items-center justify-center p-10">
      <div className="sm:mt-2 sm:py-4 text-primary-dark">
        <form onSubmit={formikPass.handleSubmit}>
          <div>
            <Input
              type="password"
              placeholder="********"
              {...getPropsWithLabel("newPassword", "Nueva contraseña")}
            />
            <Input
              type="password"
              placeholder="********"
              {...getPropsWithLabel(
                "confirmNewPassword",
                "Confirmar contraseña"
              )}
            />
          </div>
          <button
            type="submit"
            disabled={!formikPass.isValid || !formikPass.dirty}
            className="bg-primary-darker mt-5 text-white p-2 rounded hover:bg-primary-dark md:h-8 flex items-center justify-center md:w-36 md:text-base text-xs sm:text-sm"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassStep2;
