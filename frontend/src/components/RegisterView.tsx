"use client";

import React, { useEffect, useState } from "react";
import { Register } from "./Register/Register";
import Image from "next/image";
import loginBanner from "@/assets/loginBanner.png";
import buyBanner from "@/assets/registerBuyBanner.png";
import Link from "next/link";
import { IRegisterViewProps } from "@/types";

export const RegisterView: React.FC<IRegisterViewProps> = ({
  userTypeParam,
}) => {
  const [userType, setUserType] = useState(
    userTypeParam == "buyer" ? false : true
  );
  const titleRef = React.useRef<HTMLHeadingElement>(null);

  const handleUserTypeChange = (newUserType: boolean) => {
    setUserType(newUserType);
  };

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <main className="lg:py-4 lg:px-14 bg-secondary-light">
      <div className="bg-white h-full  formGrid lg:rounded-xl ">
        <div
          className="registerBanner h-[8rem] md:h-[10rem] lg:h-[20rem]  overflow-hidden"
          ref={titleRef}
        >
          <Image
            className="lg:rounded-t-xl w-full"
            src={userType ? buyBanner : loginBanner}
            alt="portada del registro"
            layout="responsive"
            width={1000}
          />
        </div>
        <div className="registerMessage lg:mt-10">
          <div className="text-center w-full flex h-[45vh] flex-col lg:justify-between">
            <div className="">
              <h1 className="text-primary-darker text-4xl mb-4 font-bold">
                Registrate
              </h1>
              <div className="flex justify-evenly lg:flex-col">
                <div className="flex items-center lg:flex-col">
                  <div>
                    <p className="text-primary-dark">¿Ya tenés cuenta?</p>
                    <Link
                      href="/login"
                      className="text-primary-darker font-bold"
                    >
                      ¡Inicia sesión!
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="registerForm md:pr-10">
          <Register
            onUserTypeChange={handleUserTypeChange}
            userType={userType}
          />
        </div>
      </div>
    </main>
  );
};
