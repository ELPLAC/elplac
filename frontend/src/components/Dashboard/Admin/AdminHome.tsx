"use client";
import React, { useEffect, useState } from "react";
import {
  SellerRegistrations,
  UserRegistrations,
} from "@/types";
import { useFair } from "@/context/FairProvider";
import { FaCheckCircle } from "react-icons/fa";
import WithAuthProtect from "@/helpers/WithAuth";
import AdminFairHistory from "@/components/Dashboard/Admin/AdminFairHistory";

const AdminHome = () => {
  const { fairs, activeFair } = useFair();
  const [sellerCounter, setSellerCounter] = useState<SellerRegistrations[]>([]);
  const [userCounter, setUserCounter] = useState<UserRegistrations[]>([]);

  useEffect(() => {
    if (activeFair) {
      const sellers = activeFair.sellerRegistrations;
      const users = activeFair.userRegistrations;

      setSellerCounter(sellers);
      setUserCounter(users);
    }
  }, [activeFair]);

  return (
    <div className="grid grid-rows-[auto_auto_1fr] grid-cols-2 mx-5 md:mx-20 mt-8 gap-5 h-auto md:h-[80vh]">
      <div className="col-span-2">
        <div className="w-full mt-5 flex p-4 md:p-6 flex-col rounded-lg bg-[#f1fafa]">
          <div>
            {activeFair ? (
              <>
                <h1 className="font-semibold text-primary-darker text-lg md:text-xl">
                  Feria activa: {activeFair?.name || "Feria activa"}
                </h1>
                <div className="flex gap-4"></div>
                <a
                  href="/admin/postFair"
                  className="w-full md:w-30 mt-5 mb-5 bg-white flex items-center justify-center text-primary-darker gap-2 p-2 border border-[#D0D5DD] rounded-lg hover:bg-primary-darker hover:text-white hover:shadow-md transition duration-200"
                >
                  <FaCheckCircle />
                  Administrar feria
                </a>
                <a
                  href="/admin/products"
                  className="w-full md:w-45 mb-5 bg-white flex items-center justify-center text-primary-darker gap-2 p-2 border border-[#D0D5DD] rounded-lg hover:bg-primary-darker hover:text-white hover:shadow-md transition duration-200"
                >
                  <FaCheckCircle />
                  Ver productos
                </a>
                <div />
                <div className="flex flex-col md:flex-row gap-6">
                  <div>
                    <h3 className="text-[#5E5F60] text-lg">Usuarios</h3>
                    <span className="text-[#5E5F60] text-2xl md:text-3xl font-bold">
                      {userCounter?.length || 0}
                    </span>
                  </div>
                  <div className="text-[#5E5F60] text-2xl md:text-3xl font-bold"></div>
                  <div>
                    <h3 className="text-[#5E5F60] text-lg">Vendedores</h3>
                    <span className="text-[#5E5F60] text-2xl md:text-3xl font-bold">
                      {sellerCounter?.length || 0}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-5">
                <h1 className="font-semibold text-primary-darker text-lg md:text-xl">
                  ¡No hay Ferias Activas! Creá una feria para comenzar...
                </h1>
                <a
                  href="/admin/fairs"
                  className="w-full md:w-45 mt-5 mb-5 bg-white flex items-center justify-center text-primary-darker gap-2 p-2 border border-[#D0D5DD] rounded-lg hover:bg-primary-darker hover:text-white hover:shadow-md transition duration-200"
                >
                   <FaCheckCircle />
                  Crear feria
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row-span-3 mb-5 col-span-2 rounded-lg bg-[#f1fafa]">
        <AdminFairHistory />
      </div>
    </div>
  );
};

export default WithAuthProtect({ Component: AdminHome, role: "admin" });