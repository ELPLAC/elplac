import React from "react";
import Image from "next/image";
import facebook from "@/assets/facebook.svg";
import instagram from "@/assets/instagram.svg";
import pinterest from "@/assets/pinterest.svg";
import datafiscal from "@/assets/datafiscal.png";
import Link from "next/link";
import logo from "@/assets/logo.png";

const Footer: React.FC = () => {
  return (
    <div style={{ backgroundColor: "#fffcf3" }} className="pt-5 pb-5 lg:px-5">
      <div className="flex flex-row justify-between items-start w-full px-4 py-2 sm:px-5">
        <div className="flex flex-col items-start gap-2 lg:w-1/3">
          <Link href="/">
            <Image
              className="my-2"
              src={logo}
              alt="logo"
              width={100}
              height={40}
            />
          </Link>
          <Link
            href="/help"
            className="text-sm sm:text-base lg:text-lg font-medium hover:text-secondary-dark"
          >
            Ayuda
          </Link>
          <Link
            href="/terms&conditions"
            className="text-sm sm:text-base lg:text-lg font-medium hover:text-secondary-dark"
          >
            Términos y Condiciones
          </Link>
          <div className="flex flex-col items-start">
            <p className="text-sm sm:text-base lg:text-lg font-medium">
              Seguridad y Certificaciones
            </p>
            <Image
              src={datafiscal}
              alt="datafiscal"
              width={60}
              height={60}
              className="w-12 sm:w-14 lg:w-16"
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-center lg:w-1/3 gap-3 h-32">
          <Link href="https://www.facebook.com/elplacarddemibebot">
            <Image
              src={facebook}
              alt="Facebook"
              width={30}
              height={30}
              className="w-8 sm:w-9 lg:w-11"
            />
          </Link>
          <Link href="https://www.instagram.com/el_placard_de_mi_bebot">
            <Image
              src={instagram}
              alt="Instagram"
              width={40}
              height={40}
              className="w-8 sm:w-9 lg:w-11"
            />
          </Link>
          <Link href="https://ar.pinterest.com/elplacarddemibebot/_created/">
            <Image
              src={pinterest}
              alt="Pinterest"
              width={40}
              height={40}
              className="w-8 sm:w-9 lg:w-11"
            />
          </Link>
        </div>
      </div>

      <div className="text-sm sm:text-base font-medium flex items-center justify-center w-full text-center mt-4 sm:mt-0 h-4 sm:h-4">
        <h3>Copyright © 2024 EL PLAC. Todos los derechos reservados.</h3>
      </div>
    </div>
  );
};


export default Footer;
