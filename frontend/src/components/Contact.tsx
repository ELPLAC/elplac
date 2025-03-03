/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ContactForm from "./ContactForm";

export const Contact: React.FC = () => {
  return (
    <div className="h-auto bg-primary-lighter flex flex-col lg:flex-row justify-center items-center m-auto sm:max-w-[66%] mb-12 mt-12"> 
      <div className="w-full sm:h-auto flex flex-col justify-end items-end pr-4 sm:pr-0 lg:pr-20 sm:space-y-1">
        <div className="w-full max-w-md text-right innerShadowTitle text-2xl sm:text-4xl xl:text-5xl mb-4" style={{ color: "#7da65d" }}>
          #Contactanos
        </div>
        <ContactForm />
      </div>
    </div>
  );
};
