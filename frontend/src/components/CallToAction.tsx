"use client";

import React from "react";
import { useProfile } from "@/context/ProfileProvider"; 
import buy from "@/assets/buy.svg";
import sell from "@/assets/sell.svg";
import Image from "next/image";
import Link from "next/link";

export const CallToAction = () => {
  const { userDtos } = useProfile(); 

  const isLoggedIn = !!userDtos;

  return (
    <div className="flex flex-col md:flex-row w-full h-auto mt-12">
      <div
        className="flex flex-col justify-center items-center shadow-md z-20 w-full h-1/2 md:h-auto p-5"
        style={{ backgroundColor: "#E4F1D0" }} 
      >
        <div className="flex justify-center items-center w-full h-auto">
          <h1 className="innerShadowTitle text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] mt-6 mb-4" style={{ color: "#7da65d" }} >
            #Comprá&nbsp;&nbsp;#Ahorrá
          </h1>
        </div>
        <div
          className="bg-slate-50 bg-opacity-50 rounded-3xl flex flex-col h-auto gap-2 w-3/4 items-center justify-center text-center p-3"
          style={{
            border: "2px solid #99C078", 
          }}
        >
          <div className="flex flex-col items-center justify-center h-[6.5vh] md:h-[12.5vh] lg:h-[12.5vh] xl:h-[10vh]">
            <p className="text-[#2A4546] font-semibold text-xs sm:text-base md:text-base lg:text-lg md:leading-tight">
            Encontrá la mejor calidad y variedad de segunda mano. ¡Enterate de la próxima feria y reservá tu cupo!
            </p>
          </div>
          <div className="flex lg:my-2 flex-col items-center justify-center">
            <Link href="/register/buyer">
              <button
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 p-1 rounded-3xl flex items-center justify-center"
                style={{
                  backgroundColor: "#F1FAE8", 
                  border: "2px solid #99C078", 
                }}
                disabled={isLoggedIn} 
              >
                <Image
                  src={buy}
                  className="w-6 sm:w-7 md:w-8 lg:w-9"
                  alt="imagen con carrito de compras"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-primary-light flex flex-col justify-center items-center shadow-md z-20 w-full h-1/2 md:h-auto p-5">
        <div className="flex justify-center items-center w-full h-auto">
          <h1 className="innerShadowTitleBlue text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] mt-6 mb-4">
            #Vendé&nbsp;&nbsp;#Ganá
          </h1>
        </div>
        <div className="bg-slate-50 bg-opacity-50 border-[2px] border-primary-dark rounded-3xl flex flex-col h-auto gap-2 w-3/4 items-center justify-center text-center p-3">
          <div className="flex flex-col items-center justify-center h-[6.5vh] md:h-[12.5vh] lg:h-[12.5vh] xl:h-[10vh]">
            <p className="text-[#2A4546] font-semibold text-xs sm:text-base md:text-base lg:text-lg md:leading-tight">
            Ganá el 70% de tus precios vendiendo en nuestras ferias. ¡Inscribite y empezá a cargar tus productos!
            </p>
          </div>
          <div className="flex flex-col my-1 items-center justify-center">
            <Link href="/register/seller">
              <button
                className="bg-primary-lighter border-[2px] hover:bg-secondary-lighter hover:bg-opacity-70 border-primary-dark w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 p-1 rounded-3xl flex items-center justify-center"
                disabled={isLoggedIn} 
              >
                <Image
                  src={sell}
                  alt="imagen con icono de venta"
                  className="w-6 sm:w-7 md:w-8 lg:w-9"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
