"use client";
import { dashboardEnum } from "@/types";
import React, { useEffect, useState } from "react";
import SidebarDashboard from "./SidebarDashboard";
import { useProfile } from "@/context/ProfileProvider";
import DashboardCard from "./DashboardCard";
import { verifyUserDetails } from "@/helpers/verifyUserDetails";
import WithAuthProtect from "@/helpers/WithAuth";
import { useFair } from "@/context/FairProvider";
import Image from "next/image";
import { IoShirtOutline } from "react-icons/io5";
import fairs from "@/assets/dashboard3.svg";

const MainDashboardSeller: React.FC = () => {
  const { userDtos, sellerDtos } = useProfile();
  const { activeFair } = useFair();
  const [isRegisteredAtFair, setIsRegisteredAtFair] = useState(false);
  const [verificationMsg, setVerificationMsg] = useState<string | null>(null);

  useEffect(() => {
    if (sellerDtos?.registrations) {
      setIsRegisteredAtFair(
        sellerDtos.registrations.some(
          (registration) => registration.fair.name === activeFair?.name
        )
      );
    }
  }, [sellerDtos, activeFair]);

  useEffect(() => {
    if (userDtos) {
      setVerificationMsg(verifyUserDetails(userDtos));
    }
  }, [userDtos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-8 gap-0 relative min-h-screen">
      <aside className="hidden md:block md:col-span-2 lg:col-span-1 bg-secondary-lighter">
        <SidebarDashboard userRole={userDtos?.role} />
      </aside>

      <main className="p-4 sm:p-8 md:p-16 flex flex-col h-full md:col-span-6 lg:col-span-7 bg-secondary-lighter">
        <h1 className="pb-6 text-primary-darker text-2xl sm:text-3xl md:text-4xl">
          Bienvenid@ <span className="font-bold">{userDtos?.name}!</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:flex lg:flex-wrap gap-4 items-start sm:items-stretch h-full">
          <DashboardCard
            title="Mi perfil"
            description="Configurá tus datos de contacto, medios de pago, claves y accedeé a tu historial de ferias"
            typeEnum={dashboardEnum.profile}
            message={verificationMsg}
            classname="p-5 bg-secondary-light text-wrap w-full sm:w-80 rounded-[2.5rem] h-auto sm:h-48 shadow-xl"
          />

          <DashboardCard
            title={
              verificationMsg ? (
                <span className="flex gap-2">
                  <Image src={fairs} alt="Icono de ferias" width={30} height={30} />
                  Mis Ferias
                </span>
              ) : (
                "Mis Ferias"
              )
            }
            description={
              verificationMsg
                ? "Completá los datos faltantes y recarga la página para poder inscribirte a las ferias."
                : isRegisteredAtFair
                ? "Enterate de las próximas ferias, inscribite y sé parte de nuestra comunidad."
                : "Enterate de las próximas ferias, inscribite y sé parte de nuestra comunidad."
            }
            typeEnum={!verificationMsg ? dashboardEnum.fairs : ""}
            classname={`p-5 bg-secondary-light text-wrap w-full sm:w-80 rounded-[2.5rem] h-auto sm:h-48 shadow-xl ${verificationMsg ? "cursor-not-allowed" : ""}`}
          />

          <DashboardCard
            title={
              verificationMsg || !isRegisteredAtFair ? (
                <span className="flex gap-2">
                  <IoShirtOutline style={{ color: "#2f8083" }} size={30} />
                  Mis Productos
                </span>
              ) : (
                "Mis Productos"
              )
            }
            description={
              verificationMsg || !isRegisteredAtFair
                ? "¡Inscribite para empezar a vender!"
                : "Vende tus productos, participa de las liquidaciones."
            }
            typeEnum={isRegisteredAtFair ? dashboardEnum.products : ""}
            classname={`p-5 bg-secondary-light text-wrap w-full sm:w-80 rounded-[2.5rem] h-auto sm:h-48 shadow-xl ${!isRegisteredAtFair ? "cursor-not-allowed bg-slate-200" : ""}`}
          />
        </div>
      </main>
    </div>
  );
};

export default WithAuthProtect({
  Component: MainDashboardSeller,
  role: "seller",
});
