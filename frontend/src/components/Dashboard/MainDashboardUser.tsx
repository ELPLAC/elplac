"use client";
import React, { useEffect, useState } from "react";
import SidebarDashboard from "./SidebarDashboard";
import { useProfile } from "@/context/ProfileProvider";
import DashboardCard from "./DashboardCard";
import { dashboardEnum } from "@/types";
import { verifyUserDetails } from "@/helpers/verifyUserDetails";
import WithAuthProtect from "@/helpers/WithAuth";

const MainDashboardUser: React.FC = () => {
  const { userDtos } = useProfile();
  const [verificationMsg, setVerificationMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkingMail = async () => {
      if (userDtos) {
        const verificationMessage = verifyUserDetails(userDtos);
        if (verificationMessage) {
          setVerificationMsg(verificationMessage);
        }
      }
    };

    checkingMail();
  }, [userDtos]);

  return (
    <div className="grid grid-cols-8 gap-0 relative place-content-center">
      <div className="hidden sm:block bg-secondary-lighter h-full col-span-1">
          <SidebarDashboard userRole={userDtos?.role} />
        </div>
      <div className="bg-secondary-lighter p-16 flex flex-col h-[100vh] col-span-6 sm:col-span-7">
        <h1 className="pb-10 text-primary-darker text-4xl">
          Bienvenid@ <span className="font-bold">{userDtos?.name}!</span>
        </h1>
        <div className="flex gap-4 flex-wrap">
          <DashboardCard
            title="Mi perfil"
            description="Configura tus datos de contacto, medios de pago, claves, inscribite a una feria y accede a tu historial"
            typeEnum={dashboardEnum.profile}
            message={verificationMsg}
            classname="p-5 relative bg-secondary-light text-wrap w-fit sm:w-80 rounded-[2.5rem] sm:h-48 shadow-xl"
          />
          {/* <DashboardCard
            title="Vendé tus productos"
            description="Forma parte de nuestra ferias, y vendé tus productos de una manera muy fácil"
            typeEnum={dashboardEnum.changeType}
            classname="p-5  relative bg-secondary-light text-wrap w-fit sm:w-80 rounded-[2.5rem] sm:h-48 shadow-xl"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default WithAuthProtect({ Component: MainDashboardUser, role: "user" });
