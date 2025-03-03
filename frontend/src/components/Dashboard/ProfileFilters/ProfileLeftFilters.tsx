import React from "react";
import ProfileImage from "./ProfileImage";
import { PiCoatHanger } from "react-icons/pi";
import { IProfileLeftFilters } from "@/types";
import {
  IoPersonOutline,
  IoPersonSharp,
  IoSettingsOutline,
  IoSettingsSharp,
} from "react-icons/io5";
import { MdCreditCard } from "react-icons/md";
import { MdOutlineCreditCard } from "react-icons/md";
import "./profilefilters.css";

const ProfileLeftFilters: React.FC<IProfileLeftFilters> = ({
  dashBoardFilter,
  setDashBoardFilter,
  handleImageUpload,
  fileInputRef,
  handleChangePhotoClick,
  userRole,
}) => {
  return (
    <div className="mt-2 flex sm:flex-col sm:mt-0 ml-1 sm:ml-0 sm:gap-3 sm:p-4 xl:pt-10 text-primary-darker container-general">
      <div className="flex w-fit items-center gap-2 mb-2 xl:gap-4 xl:mb-5">
        {dashBoardFilter === "Mis datos de contacto" ? (
          <IoPersonSharp
            className="w-8 h-8 md:w-12 md:h-12 p-2 rounded-md shadow-lg bg-secondary-light"
            style={{
              color: "#2f8083",
              filter: "drop-shadow(0 1px 3px rgba(47, 128, 131, 0.5))",
            }}
            size={40}
          />
        ) : (
          <IoPersonOutline
            className="w-8 h-8 md:w-12 md:h-12 p-2 rounded-md shadow-lg bg-secondary-light"
            style={{ color: "#2f8083" }}
            size={40}
          />
        )}
        <button
          className={`text-sm flex sm:hidden text-start sm:text-base lg:text-lg xl:text-xl hover:text-secondary-darker w-fit hover:cursor-pointer ${
            dashBoardFilter === "Mis datos de contacto" && "font-semibold"
          }`}
          onClick={() => setDashBoardFilter("Mis datos de contacto")}
        >
          Datos
        </button>

        <button
          className={`text-sm hidden sm:flex text-start sm:text-base lg:text-lg xl:text-2xl hover:text-secondary-darker w-fit hover:cursor-pointer ${
            dashBoardFilter === "Mis datos de contacto" && "font-semibold"
          }`}
          onClick={() => setDashBoardFilter("Mis datos de contacto")}
        >
          Datos de contacto
        </button>
      </div>

      {userRole === "user" && (
        <div className="flex w-fit items-center gap-2 mb-2 xl:gap-4 xl:mb-5">
          {dashBoardFilter === "Ferias" ? (
            <PiCoatHanger
              className="w-8 h-8 md:w-12 md:h-12 p-2 rounded-md shadow-lg bg-secondary-light"
              style={{
                color: "#2f8083",
                filter: "drop-shadow(0 1px 3px rgba(47, 128, 131, 0.5))",
              }}
              size={40}
            />
          ) : (
            <PiCoatHanger
              className="w-8 h-8 md:w-12 md:h-12 p-2 rounded-md shadow-lg bg-secondary-light"
              style={{ color: "#2f8083" }}
              size={40}
            />
          )}

          <button
            className={`text-sm flex sm:hidden text-start sm:text-base lg:text-lg xl:text-xl hover:text-secondary-darker w-fit hover:cursor-pointer ${
              dashBoardFilter === "Ferias" && "font-semibold"
            }`}
            onClick={() => setDashBoardFilter("Ferias")}
          >
            Ferias
          </button>

          <button
            className={`text-sm hidden sm:flex text-start sm:text-base lg:text-lg xl:text-2xl hover:text-secondary-darker w-fit hover:cursor-pointer ${
              dashBoardFilter === "Ferias" && "font-semibold"
            }`}
            onClick={() => setDashBoardFilter("Ferias")}
          >
            Ferias
          </button>
        </div>
      )}

      <div className="flex w-fit items-center gap-2 mb-2 xl:gap-4 xl:mb-5">
        {dashBoardFilter === "Historial de ferias" ? (
          <PiCoatHanger
            className="w-8 h-8 md:w-12 md:h-12 p-2 rounded-md shadow-lg bg-secondary-light"
            style={{
              color: "#2f8083",
              filter: "drop-shadow(0 1px 3px rgba(47, 128, 131, 0.5))",
            }}
            size={40}
          />
        ) : (
          <PiCoatHanger
            className="w-8 h-8 md:w-12 md:h-12 p-2 rounded-md shadow-lg bg-secondary-light"
            style={{ color: "#2f8083" }}
            size={40}
          />
        )}
        <button
          className={`text-sm flex sm:hidden text-start sm:text-base lg:text-lg xl:text-xl hover:text-secondary-darker w-fit hover:cursor-pointer ${
            dashBoardFilter === "Historial de ferias" && "font-semibold"
          }`}
          onClick={() => setDashBoardFilter("Historial de ferias")}
        >
          Historial
        </button>
        <button
          className={`text-sm hidden sm:flex text-start sm:text-base lg:text-lg xl:text-2xl hover:text-secondary-darker w-fit hover:cursor-pointer ${
            dashBoardFilter === "Historial de ferias" && "font-semibold"
          }`}
          onClick={() => setDashBoardFilter("Historial de ferias")}
        >
          Historial de ferias
        </button>
      </div>

      {userRole === "seller" && (
        <div className="flex w-fit items-center gap-2 mb-2 xl:gap-4 xl:mb-5">
          {dashBoardFilter === "Datos de vendedor" ? (
            <MdCreditCard
              className="w-8 h-8 md:w-12 md:h-12 p-2 rounded-md shadow-lg bg-secondary-light"
              style={{
                color: "#2f8083",
                filter: "drop-shadow(0 1px 3px rgba(47, 128, 131, 0.5))",
              }}
              size={50}
            />
          ) : (
            <MdOutlineCreditCard
              className="w-8 h-8 md:w-12 md:h-12 p-2 rounded-md shadow-lg bg-secondary-light"
              style={{ color: "#2f8083" }}
              size={50}
            />
          )}
          <button
            className={`text-sm flex sm:hidden text-start sm:text-base lg:text-lg xl:text-xl ${
              dashBoardFilter === "Datos de vendedor" && "font-semibold"
            }`}
            onClick={() => setDashBoardFilter("Datos de vendedor")}
          >
            Datos de vendedor
          </button>
          <button
            className={`text-sm hidden sm:flex text-start sm:text-base lg:text-lg xl:text-2xl hover:text-secondary-darker w-fit hover:cursor-pointer ${
              dashBoardFilter === "Datos de vendedor" && "font-semibold"
            }`}
            onClick={() => setDashBoardFilter("Datos de vendedor")}
          >
            Datos de vendedor
          </button>
        </div>
      )}

      <div className="flex w-fit items-center gap-2 mb-2 xl:gap-4 xl:mb-5">
        {dashBoardFilter === "Ajustes de cuenta" ? (
          <IoSettingsSharp
            className="w-8 h-8 md:w-12 md:h-12 p-2 rounded-md shadow-lg bg-secondary-light"
            style={{
              color: "#2f8083",
              filter: "drop-shadow(0 1px 3px rgba(47, 128, 131, 0.5))",
            }}
            size={50}
          />
        ) : (
          <IoSettingsOutline
            className="w-8 h-8 md:w-12 md:h-12 p-2 rounded-md shadow-lg bg-secondary-light"
            style={{ color: "#2f8083" }}
            size={50}
          />
        )}
        <button
          className={`text-sm flex sm:hidden text-start sm:text-base lg:text-lg xl:text-xl ${
            dashBoardFilter === "Ajustes de cuenta" && "font-semibold"
          }`}
          onClick={() => setDashBoardFilter("Ajustes de cuenta")}
        >
          Ajustes de cuenta
        </button>
        <button
          className={`text-sm hidden sm:flex text-start sm:text-base lg:text-lg xl:text-2xl hover:text-secondary-darker w-fit hover:cursor-pointer ${
            dashBoardFilter === "Ajustes de cuenta" && "font-semibold"
          }`}
          onClick={() => setDashBoardFilter("Ajustes de cuenta")}
        >
          Ajustes de cuenta
        </button>
      </div>

      <div className="w-full flex">
        <ProfileImage
          className={
            "mt-5 relative group h-12 w-12 sm:h-20 sm:w-20 lg:h-24 lg:w-24 xl:w-32 xl:h-32 rounded-full border border-secondary-darker bg-slate-100 overflow-hidden"
          }
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          handleChangePhotoClick={handleChangePhotoClick}
        />
      </div>
    </div>
  );
};

export default ProfileLeftFilters;
