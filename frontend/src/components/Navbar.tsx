"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaUser, FaBars } from "react-icons/fa";
import { useAuth } from "@/context/AuthProvider";
import Image from "next/image";
import profile from "@/assets/profile.png";
import logo from "@/assets/logo.png";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./Notifications/Notifications";

import { useProfile } from "@/context/ProfileProvider";

const Navbar: React.FC = () => {
  const { token, logout } = useAuth();
  const { userDtos, profileImageChanged, setProfileImageChanged } =
    useProfile();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (profileImageChanged) {
      setProfileImageChanged(false);
    }
  }, [profileImageChanged, setProfileImageChanged]);

  const handleToggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleToggleMobile = () => {
    setIsMobile(!isMobile);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };

  const handleLogout = () => {
    logout();
    notify("ToastSuccess", "¡Sesión finalizada!");
    router.push("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`flex w-full lg:pr-16 h-full items-center justify-end `}
      style={{ backgroundColor: "#fffcf3" }}
    >
      <ul
        className={`flex text-xl lg:gap-6 font-semibold 
          
            
             text-primary-darker
         items-center  gap-24 md:gap-1 xl:gap-5`}
      >
        <li>
          <div className="sm:mr-2 self-start ">
          <Link href="/">
              <Image alt="logo" src={logo} width={200} height={150}></Image>
            </Link>
          </div>
        </li>
        <li className="hover:underline hidden lg:flex">
          <Link href="/">INICIO</Link>
        </li>

        <li className="hover:underline hidden text-nowrap lg:flex">
          <Link href="/help">AYUDA</Link>
        </li>
        <li className="hover:underline hidden lg:flex relative">
          {token ? (
            <div className="flex items-center">
              <div className="relative group h-16 w-16 rounded-full border border-secondary-darker flex items-center justify-center">
                <button className="absolute h-[60px] w-[60px] p-0 m-0 bg-slate-100 rounded-full">
                  <Image
                    onClick={handleToggleDropdown}
                    src={userDtos?.profile_picture || profile}
                    alt="user profile"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="-0px -0px"
                    className="overflow-hidden rounded-full"
                  />
                </button>
              </div>
              {token && dropdownVisible && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full  -translate-x-[30%] mt-2 py-2  bg-secondary-lighter rounded-md shadow-md z-10"
                >
                  <Link
                    href={`${
                      userDtos?.role === "admin" ? "/admin" : "/dashboard"
                    }`}
                    onClick={() => setDropdownVisible(false)}
                    className="block px-4 py-2 font-semibold text-nowrap text-primary-darker hover:bg-secondary-light"
                  >
                    Mi Cuenta
                  </Link>
                  <Link
                    href="/"
                    onClick={() => {
                      handleLogout();
                      setDropdownVisible(false);
                    }}
                    className="block px-4 py-2 font-semibold text-nowrap text-primary-darker hover:bg-secondary-light"
                  >
                    Cerrar sesión
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <button onClick={handleToggleDropdown}>
              <FaUser />
            </button>
          )}
          {!token && dropdownVisible && (
            <div
              ref={dropdownRef}
              className="absolute top-full -translate-x-1/2 mt-2 py-2 w-fit bg-secondary-lighter rounded-md shadow-md z-10"
            >
              <Link
                href="/login"
                onClick={() => setDropdownVisible(false)}
                className="block px-4 py-2 font-semibold text-nowrap text-primary-darker hover:bg-secondary-light"
              >
                Inicia sesión
              </Link>
              <Link
                href="/register/buyer"
                onClick={() => setDropdownVisible(false)}
                className="block px-4 py-2 font-semibold text-primary-darker hover:bg-secondary-light"
              >
                Registrate
              </Link>
            </div>
          )}
        </li>
        <div className="relative">
          <li className="hover:underline flex lg:hidden mr-5">
            <button onClick={handleToggleMobile}>
              <FaBars />
            </button>
            {isMobile && (
              <div
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderBottom: "25px solid var(--secondary-light)",
                }}
                className="absolute top-4 right-5 z-20"
              ></div>
            )}
          </li>
          {isMobile && (
            <div className="bg-secondary-light h-auto w-36 absolute right-0 top-10 z-40 flex flex-col p-5 text-sm shadow-md rounded-lg gap-4">
              <li className="hover:underline flex lg:hidden  ">
                <Link href="/">Inicio</Link>
              </li>
              <li className="hover:underline flex lg:hidden ">
                <Link href="/help">Ayuda</Link>
              </li>
              {!token ? (
                <>
                  <li className="hover:underline flex lg:hidden ">
                    <Link href="/login">Iniciar Sesión</Link>
                  </li>
                  <li className="hover:underline flex lg:hidden ">
                    <Link href="/register/buyer">Registrarse</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:underline flex lg:hidden ">
                    <Link href="/dashboard">Mi Cuenta</Link>
                  </li>
                  <li className="hover:underline flex lg:hidden ">
                    <Link href="/" onClick={handleLogout}>
                      Cerrar Sesión
                    </Link>
                  </li>
                </>
              )}
            </div>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
