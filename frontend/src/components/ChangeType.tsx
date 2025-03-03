"use client";
import { useProfile } from "@/context/ProfileProvider";
import { changeRole } from "@/helpers/services";
import { Checkbox, Label } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./Notifications/Notifications";
import { FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthProvider";
import WithAuthProtect from "@/helpers/WithAuth";

const ChangeType = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { userDtos } = useProfile();
  const { token, setRoleAuth } = useAuth();
  const userId = userDtos?.id;
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  const titleRef = React.useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const router = useRouter();

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await changeRole(userId, role, token);
      setRoleAuth("seller");
      localStorage.setItem("role", "seller");
      router.push("/");
    } catch (error) {
    }
  };

  return (
    <div>
      <div className="w-full h-32 flex items-center">
        <Navbar />
      </div>
      <div className="bg-secondary-lighter flex flex-col items-center h-[50vh] w-screen">
        <div className="flex flex-col items-center  w-1/2 h-screen justify-around text-center">
          <div className="flex gap-2 items-center">
            <button className="w-10 h-10 p-2 rounded-full border border-primary-dark text-primary-dark">
              <Link href="/dashboard">
                <FaChevronLeft />
              </Link>
            </button>
            <h1
              className=" text-primary-darker text-xl  lg:text-4xl font-bold"
              ref={titleRef}
            >
              ¡Formá parte de nuestras ferias y vendé tus productos!
            </h1>
          </div>
          <p className="text-sm lg:text-base w-screen lg:w-1/2 p-5 lg:p-0">
            Por favor revisá los términos y condiciones para conocer mas del
            proceso de carga de productos y la dinámica que proponemos para que
            te puedas registrar a cualquiera de las próximas ferias{" "}
          </p>
          <div className="flex items-center gap-2">
            <Checkbox
              id="accept"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <Label>
              <span className={`${"text-primary-darker"} `}>Acepto los </span>
              <a
                href="/terms&conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-darker hover:underline"
              >
                Términos y Condiciones
              </a>
            </Label>
          </div>
          <div className="flex justify-center">
            <button
              className={`
      bg-primary-dark w-56 h-12 rounded-3xl text-center text-white text-base font-bold
      ${!isChecked ? "opacity-50 cursor-not-allowed" : ""}
    `}
              disabled={!isChecked}
              onClick={() => {
                if (userId) {
                  handleRoleChange(userId, "seller");
                  notify("ToastSuccess", "¡Ya puedes empezar a vender!");
                } else {
                }
              }}
            >
              ¡Comienza a vender!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithAuthProtect({ Component: ChangeType, role: "user" });
