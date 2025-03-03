/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import gmailLogo from "@/assets/gmailLogo.svg";
import { URL } from "../../envs";

const GoogleLoginButton = () => {
  const handleLoginSuccess = () => {
    window.location.href = `${URL}/auth/googleLogin`;
  };

  return (
    <button onClick={handleLoginSuccess}>
      <div className="mt-1 lg:mt-6 w-15 h-15 bg-white border p-2 border-white shadow-[1px_4px_4px_rgba(0,0,0,0.25)] rounded-lg">
        <Image src={gmailLogo} alt="logo de Gmail" className=""></Image>
      </div>
    </button>
  );
};

export default GoogleLoginButton;
