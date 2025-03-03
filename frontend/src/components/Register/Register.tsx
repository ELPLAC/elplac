"use client";
import { IRegisterProps } from "@/types";

import buy from "@/assets/buy.svg";
import sell from "@/assets/sell.svg";
import Image from "next/image";

import RegisterSeller from "./RegisterSeller";
import RegisterUser from "./RegisterUser";

export const Register: React.FC<IRegisterProps> = ({
  onUserTypeChange,
  userType,
}) => {

  const handleUserTypeChange = (newUserType: boolean) => {
    onUserTypeChange(newUserType);
  };

  return (
    <div className="grow-down">
      <div className=" relative h-max -translate-y-20 p-10  bg-white  rounded-b-[30px] lg:rounded-[30px] shadow-lg mt-6">
        {userType ? (
          <>
            <div className="w-80 m-auto">
              <h1 className="text-primary-dark h-12 mb-3  font-bold text-lg leading-relaxed text-center">
                ¿QUERÉS VENDER TUS PRODUCTOS? INSCRIBITE COMO VENDEDOR
              </h1>
            </div>
            <div className="border border-primary-default w-[75%] m-auto mb-5"></div>
          </>
        ) : (
          <>
            <div className="w-80 m-auto">
              <h1 className="text-secondary-darker h-12 mb-3 font-bold text-lg leading-relaxed text-center">
                ¿QUERÉS COMPRAR? INSCRIBITE COMO COMPRADOR
              </h1>
            </div>
            <div className="border border-secondary-darker w-[75%] m-auto mb-5"></div>
          </>
        )}
        <button
          type="button"
          onClick={() => handleUserTypeChange(false)}
          className={`w-[51%] lg:w-fit py-6 lg:px-6 lg:py-20 cursor-pointer ${
            userType ? "bg-[#F8F8F8]" : "bg-white"
          } lg:rounded-tl-3xl lg:rounded-bl-3xl flex flex-col items-center gap-2 absolute top-0 lg:top-auto rounded-tl-[30px]  -translate-y-[99%] lg:-translate-y-0  left-0 lg:-translate-x-[99%] shadow-lg sm:shadow-mobileLeft lg:shadow-customLeft`}>
          <p className="lg:absolute font-medium max-h-5 lg:-left-[120%] text-secondary-darker">
            #Comprá
          </p>
          <Image src={buy} className="h-5" alt="Icono de compra" />
        </button>
        <button
          type="button"
          onClick={() => handleUserTypeChange(true)}
          className={`w-1/2 lg:w-fit py-6  lg:px-6 lg:py-20 cursor-pointer ${
            userType ? "bg-white" : "bg-[#F8F8F8]"
          } lg:rounded-tl-3xl lg:rounded-bl-3xl flex flex-col items-center gap-2 absolute rounded-tr-[30px] lg:rounded-tr-[0px] top-0 lg:top-auto translate-x-[100%] -translate-y-[99%] left-0 lg:-translate-x-[99%] lg:translate-y-[99%] shadow-mobileRight lg:shadow-customLeft`}>
          <p className="lg:absolute font-medium max-h-5  lg:-left-[120%] text-primary-dark">
            #Vendé
          </p>
          <Image src={sell} className="h-5" alt="Icono de venta" />
        </button>
        {!userType ? <RegisterUser /> : <RegisterSeller />}
      </div>
    </div>
  );
};
