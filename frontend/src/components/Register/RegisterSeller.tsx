import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { postSellerRegister } from "@/helpers/services";
import { registerSellerValidations } from "@/helpers/validations";
import { formTypeEnum, ISeller } from "@/types";
import Input from "../Input";
import { Checkbox, Label } from "flowbite-react";
import { notify } from "../Notifications/Notifications";

const RegisterSeller: React.FC = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const signUpSeller = async (seller: ISeller) => {
    setLoading(true);
    console.log("Datos enviados al backend:", seller);
    try {
      const res = await postSellerRegister(seller);
      console.log("Respuesta del backend:", res);
      if (res?.ok) {
        formikSeller.resetForm();
        router.push("/login");
        notify(
          "ToastSuccess",
          "Revisa tu casilla de correo para confirmar tu cuenta"
        );
      } else {
        throw new Error("Error en el registro");
      }
    } catch (error: any) {
      notify("ToastError", error.message);
    } finally {
      setLoading(false);
    }
  };

  const formikSeller = useFormik<ISeller>({
    initialValues: {
      name: "",
      lastname: "",
      dni: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      social_media: "",
      id: "",
    },
    onSubmit: signUpSeller,
    validate: registerSellerValidations,
  });

  const getProps = (name: keyof ISeller) => ({
    name: name,
    userType: true,
    formType: formTypeEnum.login,
    onChange: formikSeller.handleChange,
    onBlur: formikSeller.handleBlur,
    value: formikSeller.values[name],
    touched: formikSeller.touched[name],
    errors: !formikSeller.values[name] ? undefined : formikSeller.errors[name],
  });

  return (
    <div>
      <form onSubmit={formikSeller.handleSubmit}>
        <div className="flex gap-4">
          <Input
            label="Nombre"
            type="text"
            placeholder="Juan"
            {...getProps("name")}
          />
          <Input
            label="Apellido"
            type="text"
            placeholder="Gomez"
            {...getProps("lastname")}
          />
        </div>
        <div className="flex gap-4">
          <Input
            label="DNI"
            type="text"
            placeholder="40500300"
            {...getProps("dni")}
          />
          <Input
            label="Email"
            type="email"
            placeholder="juan@gmail.com"
            {...getProps("email")}
          />
        </div>
        <div className="flex gap-4">
          <Input
            label="Contraseña"
            type="password"
            placeholder="********"
            {...getProps("password")}
          />
          <Input
            label="Repetir contraseña"
            type="password"
            placeholder="********"
            {...getProps("confirmPassword")}
          />
        </div>
        <div className="flex gap-4">
          <Input
            label="Teléfono"
            type="text"
            placeholder="+54 11 3030-3030"
            {...getProps("phone")}
          />
          <div>
            <Input
              label="Dirección"
              type="text"
              placeholder="Av. Siempreviva 123"
              {...getProps("address")}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <Input
              label="Instagram"
              type="text"
              placeholder="juan.gomez"
              {...getProps("social_media")}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 my-6">
          <Checkbox
            id="accept"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <Label htmlFor="accept" className="flex items-center gap-1">
            <span className="text-secondary-darker">Acepto los </span>
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
            type="submit"
            className={`bg-primary-dark w-32 h-9 my-3 rounded-3xl text-center text-white text-base font-bold  ${
              isLoading || !isChecked ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || !isChecked}
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterSeller;


