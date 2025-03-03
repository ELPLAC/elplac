import React from "react";
import Header from "./Header";


function HeaderTerms() {
  return (
    <div className="header h-auto w-full ">
      <Header />

      <div className="flex w-full h-32 flex items-center bg-primary-lighter">
      </div>

      <div className=" flex flex-col items-end w-full h-auto pr-5 pb-5 bg-primary-lighter">
        <h1 className="innerShadowTitleTerms flex justify-end items-end w-full md:w-[30vh] text-secondary-darker text-2xl sm:text-4xl md:text-[6vh] lg:text-[9vh]  font-bold text-wrap md:text-nowrap text-end md:pb-1 lg:pb-6 xl:pb-10 ">
          Términos y Condiciones
        </h1>
        <h3 className="innerShadowDescriptionTerms flex justify-end items-end w-full md:w-[18vh] text-secondary-darker text-sm sm:text-lg md:text-[3vh] lg:text-[3vh]  font-bold text-wrap md:text-nowrap text-end xl:pb-6 ">
          ¡Sumate a nuestra comunidad!
        </h3>
      </div>
    </div>
  );
}

export default HeaderTerms;
