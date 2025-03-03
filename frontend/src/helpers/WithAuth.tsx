/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useAuth } from "@/context/AuthProvider";
import { WithAuthProtectProps } from "@/types";
import { redirect } from "next/navigation";

import React, { useEffect } from "react";

const WithAuthProtect = ({ Component, role }: WithAuthProtectProps) => {
  const ProtectedComponent: React.FC = (props) => {
    const { token, loading, roleAuth } = useAuth();

    useEffect(() => {
      if (!loading) {
        if (!token) {
          redirect("/");
        } else if (role && roleAuth !== role) {
          redirect("/");
        }
      }
    }, [token, loading, roleAuth, role]);

    if (loading) {
      return (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <svg
            version="1.1"
            id="loader-1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="120px"
            height="120px"
            viewBox="0 0 50 50"
            xmlSpace="preserve"
            className="animate-spin">
            <path
              fill="#FFD47B"
              d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
            />
          </svg>
        </div>
      );
    }
    if (!token) {
      return null;
    }

    return <Component {...props} />;
  };

  return ProtectedComponent;
};

export default WithAuthProtect;
