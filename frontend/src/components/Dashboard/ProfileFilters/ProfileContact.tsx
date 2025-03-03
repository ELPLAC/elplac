import React, { useEffect } from "react";
import { useProfile } from "@/context/ProfileProvider";
import Input from "@/components/Input";
import { IProfileContact } from "@/types";

const ProfileContact: React.FC<IProfileContact> = ({
  formikUser,
  getPropsUser,
  formikSeller,
  edit,
}) => {
  const { userDtos } = useProfile();

  const getPropsWithLabel = (name: string, label: string) => {
    const props = userDtos?.role === "user" && getPropsUser(name);
    return {
      ...props,
      label,
    };
  };

  useEffect(() => {
    const formik = userDtos?.role === "user" ? formikUser : formikSeller;

    const fieldsToCheck = ["name", "lastname", "email", "dni"];

    fieldsToCheck.forEach((field) => {
      if (formik.values[field] === "" && !formik.touched[field]) {
        formik.setFieldTouched(field, true);
        formik.setFieldError(field, "Este campo es requerido");
      }
    });
  }, [userDtos?.role, formikUser, formikSeller]);

  return (
    <div className=" sm:mt-2 sm:py-4 text-primary-dark">
      <form onSubmit={formikUser.handleSubmit}>
        <Input type="text" {...getPropsWithLabel("name", "Nombre")} />
        <Input type="text" {...getPropsWithLabel("lastname", "Apellido")} />

        <Input type="email" {...getPropsWithLabel("email", "Email")} />
        <Input type="text" {...getPropsWithLabel("dni", "DNI")} />

        {edit && (
          <button
            type="submit"
            disabled={!formikUser.isValid}
            className="bg-primary-darker mt-5 text-white p-2 rounded hover:bg-primary-dark md:h-8 flex items-center justify-center md:w-36 md:text-base text-xs sm:text-sm"
          >
            Guardar Cambios
          </button>
        )}
      </form>
    </div>
  );
};

export default ProfileContact;
