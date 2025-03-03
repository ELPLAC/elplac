import { IDashboardCardProps, dashboardEnum } from "@/types";
import React from "react";
import { FaUser } from "react-icons/fa";
import { IoShirtOutline } from "react-icons/io5";
import fairs from "@/assets/dashboard3.svg";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { PiHandCoinsFill } from "react-icons/pi";
import Link from "next/link";
const DashboardCard: React.FC<IDashboardCardProps> = ({
  title,
  description,
  typeEnum,
  message,
  classname,
}) => {
  return (
    <Link href={`/dashboard/${typeEnum}`}>
      <div className={classname}>
        <div className="flex gap-2">
          {typeEnum === dashboardEnum.profile && (
            <FaUser style={{ color: "#2f8083" }} size={30} />
          )}
          {typeEnum === dashboardEnum.fairs && (
            <Image
              src={fairs}
              alt="Icono de ferias"
              style={{ color: "#2f8083" }}
              width={30}
              height={30}
            />
          )}
          {typeEnum === dashboardEnum.products && (
            <IoShirtOutline style={{ color: "#2f8083" }} size={30} />
          )}
          {typeEnum === dashboardEnum.changeType && (
            <PiHandCoinsFill style={{ color: "#2f8083" }} size={30} />
          )}
          <h3 className="text-primary-darker font-semibold text-xl">{title}</h3>
        </div>
        <p className="font-base  text-primary-darker mt-2 text-md">
          {description}
        </p>
        <p className="font-base text-red-600 mt-2 text-md">{message}</p>
        <IoIosArrowForward
          className="absolute right-0 bottom-0  -translate-x-5 -translate-y-5"
          style={{ color: "#D9AB4D" }}
          size={40}
        />
      </div>
    </Link>
  );
};

export default DashboardCard;
