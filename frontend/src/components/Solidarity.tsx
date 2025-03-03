import React from "react";
import Image from "next/image";
import CanastaSolidaria from "@/assets/CanastaSolidaria.svg";
import Link from "next/link";

export const Solidarity = () => {
  return (
    <div className="w-full" style={{ backgroundColor: "#E4F1D0" }}>
      <div className="flex flex-col lg:flex-row max-w-[90%] mx-auto justify-center items-center  p-6 md:p-24 z-20">
        <div className="w-full  md:w-1/2 mb-8 md:mb-0 flex justify-center items-center">
          <div className="mx-auto ">
            <Image
              src={CanastaSolidaria}
              alt="Canasta Solidaria"
              width={300}
              height={300}
              className="block mx-auto md:mb-4"
            />
          </div>
        </div>

        <div className="w-full md:w-2/3 max-w-xl text-center md:text-left">
          <span className="text-primary-dark text-lg md:text-base font-bold block md:ml-5">
            #CanastaSolidaria
          </span>
          <span className="text-primary-dark text-sm sm:text-base font-light block mt-2 md:ml-5">
          Nació en 2019 gracias a la colaboración de nuestros vendedores, quienes eligen donar sus productos que no califican para la venta.
            <br />
            <br />
            Estos se exponen en la Canasta Solidaria en nuestro Showroom a un precio módico. Lo recaudado en el año es destinado a una entidad benéfica.
            <br />
            <br />
            Conocé más sobre nuestras colaboraciones anuales en{" "}
            <Link
              href="https://elplacarddemibebot.mitiendanube.com/canasta-solidaria"
              legacyBehavior>
              <a
                className="text-primary-dark text-sm font-bold"
                target="_blank">
                CANASTA SOLIDARIA
              </a>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
