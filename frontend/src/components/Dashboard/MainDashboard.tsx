"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { decodeJWT } from "@/helpers/decoder";
import MainDashboardSeller from "./MainDashboardSeller";
import MainDashboardUser from "./MainDashboardUser";
import { useProfile } from "@/context/ProfileProvider";
import { getUser } from "@/helpers/services";
import Navbar from "../Navbar";

import WithAuthProtect from "@/helpers/WithAuth";

const MainDashboard: React.FC = () => {
  const { token } = useAuth();
  const { userDtos, setUserDtos } = useProfile();

  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.id) {
        const userProfile = async () => {
          const res = await getUser(token, decoded.id);
          setUserDtos(res);
        };
        userProfile();
      }
    }
  }, [token, setUserDtos]);

  if (userDtos?.role === "seller") {
    return (
      <div>
        <div className="w-full h-32 flex items-center">
          <Navbar />
        </div>
        <MainDashboardSeller />
      </div>
    );
  }

  if (userDtos?.role === "user") {
    return (
      <div>
        <div className="w-full h-32 flex items-center ">
          <Navbar />
        </div>
        <MainDashboardUser />
      </div>
    );
  }
  return null;
};

export default WithAuthProtect({
  Component: MainDashboard,
});
