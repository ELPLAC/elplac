import Input from "@/components/Input";
import { useProfile } from "@/context/ProfileProvider";
import { IProfilePayments } from "@/types";
import React, { useEffect } from "react";

const ProfilePayments: React.FC<IProfilePayments> = ({
  formikSellerPayments,
  getPropsSellerPayments,
  editSeller,
  formikSeller,
  setEditSeller,
}) => {
  const { userDtos } = useProfile();

  const getPropsWithLabel = (name: string, label: string) => {
    const props = userDtos?.role === "seller" && getPropsSellerPayments(name);
    return {
      ...props,
      label,
      onChange: formikSellerPayments.handleChange,
      onBlur: formikSellerPayments.handleBlur,
      value: formikSellerPayments.values[name],
    };
  };

  useEffect(() => {
    const formik = userDtos?.role === "seller" && formikSellerPayments;

    const fieldsToCheck = ["phone"];

    fieldsToCheck.forEach((field) => {
      if (formik.values[field].trim() === "" && !formik.touched[field]) {
        formik.setFieldTouched(field, true);
        formik.setFieldError(field, "Este campo es requerido");
      }
    });
  }, [userDtos?.role, formikSellerPayments, formikSeller]);

  return (
    <div className=" sm:mt-2 sm:py-4 text-primary-dark">
      <form onSubmit={formikSellerPayments.handleSubmit}>
        <Input type="text" {...getPropsWithLabel("phone", "Teléfono")} />
        <Input type="text" {...getPropsWithLabel("address", "Dirección")} />
        <Input type="text" {...getPropsWithLabel("social_media", "Instagram")} />
        {editSeller && (
          <button
            type="button"
            disabled={!formikSellerPayments.isValid}
            className="bg-primary-darker mt-5 text-white p-2 rounded hover:bg-primary-dark md:h-8 flex items-center justify-center md:w-36 md:text-base text-xs sm:text-sm"
            onClick={() => {
              formikSellerPayments.handleSubmit();
              setEditSeller(false);
            }}
          >
            Guardar Cambios
          </button>
        )}
      </form>
    </div>
  );
};

export default ProfilePayments;
