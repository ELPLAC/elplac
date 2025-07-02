"use client";
import React, { useEffect, useState } from "react";
import {
  SellerRegistrations,
  UserRegistrations,
} from "@/types";
import { useFair } from "@/context/FairProvider";
import { FaCheckCircle } from "react-icons/fa";
import WithAuthProtect from "@/helpers/WithAuth";

const AdminHome = () => {
  const { fairs, activeFair } = useFair();
  const [sellerCounter, setSellerCounter] = useState<SellerRegistrations[]>([]);
  const [userCounter, setUserCounter] = useState<UserRegistrations[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  const filteredFairs = fairs.filter((fair) =>
    fair.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="w-full h-full flex p-4 md:p-6 flex-col overflow-y-auto max-h-[600px] md:max-h-[900px]">
          {fairs.length > 0 ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h1 className="font-semibold text-primary-darker text-lg md:text-xl">
                  Historial de ferias
                </h1>
                <div className="relative w-full md:w-auto mt-2 md:mt-0">
                  <input
                    type="text"
                    placeholder="Buscar feria por nombre..."
                    className="p-2 pl-8 w-full md:w-auto rounded-md border border-[#E5E9EB] text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    className="absolute top-2 left-2 text-[#5E5F60]"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.742 10.742a7 7 0 1 0-1.415 1.414 8.975 8.975 0 0 1 1.415-1.414zM8 12a4 4 0 1 1 4-4 4.005 4.005 0 0 1-4 4z"
                      fill="#5E5F60"
                    />
                  </svg>
                </div>
              </div>
              {filteredFairs.length > 0 ? (
                filteredFairs.map((fair) => (
                  <div
                    key={fair.id}
                    className="shadow-lg flex flex-col font-semibold rounded-lg p-4 mt-4"
                  >
                    <h3 className="text-[#5E5F60] text-lg border-b border-primary-default mb-2">
                      {fair.name}
                    </h3>
                    <span className="text-[#5E5F60] text-lg font-normal">
                      {fair.isActive ? "Activa" : "Cerrada"}
                    </span>
                    <span className="text-[#5E5F60] text-lg font-normal">
                      {fair.sellerRegistrations.length} vendedores
                    </span>
                    <span className="text-[#5E5F60] text-lg font-normal">
                      {fair.userRegistrations.length} usuarios
                    </span>
                    <span className="text-[#5E5F60] text-lg font-normal">
                      {fair.fairDays.length} Días de feria
                    </span>
                    <div className="text-[#5E5F60] text-lg font-normal">
                      {fair.fairCategories.map((category, index) => {
                        const soldCount = category.products.filter(
                          (product) => product.status === "sold"
                        ).length;

                        const unsoldCount = category.products.filter(
                          (product) => product.status === "unsold"
                        ).length;

                        const soldOnClearanceCount = category.products.filter(
                          (product) => product.status === "soldOnClearance"
                        ).length;

                        return (
                          <span
                            key={`${category.category.name}-${index}`}
                            className="block"
                          >
                            Categoría: {category.category.name}, {soldCount}{" "}
                            vendidos, {unsoldCount} no vendidos,{" "}
                            {soldOnClearanceCount} vendidos en liquidación
                          </span>
                        );
                      })}

                      <span className="block font-bold">
                        Total de productos vendidos:{" "}
                        {fair.fairCategories.reduce((total, category) => {
                          return (
                            total +
                            category.products.filter(
                              (product) =>
                                product.status === "sold" ||
                                product.status === "soldOnClearance"
                            ).length
                          );
                        }, 0)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full pb-40 text-center">
                  <h1 className="font-semibold text-primary-darker text-lg md:text-xl">
                    Feria no encontrada...
                  </h1>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-[#5E5F60] text-lg font-normal">
              No hay Ferias en el historial aún...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithAuthProtect({ Component: AdminHome, role: "admin" });
