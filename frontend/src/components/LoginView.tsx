"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import sellerBanner from "@/assets/registerSellBanner.png";
import Link from "next/link";
import { Login } from "./Login";
import GoogleLoginButton from "./GoogleLoginButton";

export const LoginView = () => {
  const titleRef = React.useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <main className=" lg:py-4 lg:p-6 lg:px-20 xl:px-32 bg-secondary-light">
      <div className="bg-white h-full formGrid lg:rounded-xl shadow-lg mt-6">
        <div
          className="loginBanner h-[8rem] md:h-[10rem] lg:h-[20rem] overflow-hidden mb-4"
          ref={titleRef}>
          <Image
            className="rounded-t-xl object-cover w-full"
            src={sellerBanner}
            alt="portada del login"></Image>
        </div>
        <div className="loginMessage lg:mt-10 mb-6">
          <div className="text-center w-full flex flex-col lg:justify-between">
            <h1 className="text-primary-darker text-4xl mb-4 font-bold">
              Inicia Sesión
            </h1>
            <div className="flex justify-evenly lg:flex-col">
              <div className="flex gap-6 items-center lg:flex-col mb-4 lg:mb-0">
                <div>
                  <p className="text-primary-dark">¿No tenés cuenta?</p>
                  <Link
                    href="/register/buyer"
                    className="text-primary-darker font-bold ml-2 lg:ml-0">
                    ¡Registrate!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="loginForm">
          <Login />
        </div>
      </div>
    </main>
  );
};
