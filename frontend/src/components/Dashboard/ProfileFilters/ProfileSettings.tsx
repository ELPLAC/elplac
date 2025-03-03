import Input from "@/components/Input";
import { IProfileSettings } from "@/types";
import React from "react";

const ProfileSettings: React.FC<IProfileSettings> = ({
  getProps,
  formikPass,
}) => {
  const getPropsWithLabel = (name: string, label: string) => {
    const props = getProps(name);
    return {
      ...props,
      label,
    };
  };

  return (
    <div className=" sm:mt-2 sm:py-4 text-primary-dark">
      <form onSubmit={formikPass.handleSubmit}>
        <div>
          <Input
            type="password"
            placeholder="********"
            {...getPropsWithLabel("current_password", "Contraseña actual")}
          />

          <Input
            type="password"
            placeholder="********"
            {...getPropsWithLabel("newPassword", "Nueva contraseña")}
          />

          <Input
            type="password"
            placeholder="********"
            {...getPropsWithLabel("confirmNewPassword", "Confirmar contraseña")}
          />
        </div>
        <button
          type="submit"
          disabled={!formikPass.isValid}
          className="bg-primary-darker mt-5 text-white p-2 rounded hover:bg-primary-dark md:h-8 flex items-center justify-center md:w-36 md:text-base text-xs sm:text-sm">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
