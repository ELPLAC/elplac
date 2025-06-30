"use client";
import React, { useEffect, useState } from "react";
import {
  SellerRegistrations,
  UserRegistrations,
} from "@/types";
import { useFair } from "@/context/FairProvider";
import { FaCheckCircle } from "react-icons/fa";
import WithAuthProtect from "@/helpers/WithAuth";
import axios from "axios";
import { parseJwt } from "@/lib/jwt";

const AdminHome = () => {
  const { fairs, activeFair, refreshFairs } = useFair();
  const [sellerCounter, setSellerCounter] = useState<SellerRegistrations[]>([]);
  const [userCounter, setUserCounter] = useState<UserRegistrations[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      setIsAdmin(payload?.role?.toLowerCase() === "admin");
    }
  }, []);

  useEffect(() => {
    if (activeFair) {
      setSellerCounter(activeFair.sellerRegistrations || []);
      setUserCounter(activeFair.userRegistrations || []);
    }
  }, [activeFair]);

  const filteredFairs = fairs.filter((fair) =>
    fair.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteFair = async (fairId: string) => {
    const confirmDelete = confirm("¿Deseas eliminar esta feria definitivamente?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/fairs/history/${fairId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Feria eliminada exitosamente.");
      refreshFairs(); // recarga el contexto
    } catch (error) {
      console.error("Error eliminando feria", error);
      alert("Ocurrió un error al intentar eliminar la feria.");
    }
  };

  return (
    <div className="grid grid-rows-[auto_auto_1fr] grid-cols-2 mx-5 md:mx-20 mt-8 gap-5 h-auto md:h-[80vh]">
      {/* Sección de feria activa */}
      <div className="col-span-2">
        <div className="w-full mt-5 flex p-4 md:p-6 flex-col rounded-lg bg-[#f1fafa]">
          {activeFair ? (
            <>
              <h1 className="font-semibold text-primary-darker text-lg md:text-xl">
                Feria activa: {activeFair.name}
              </h1>
              <a
                href="/admin/postFair"
                className="mt-5 mb-2 w-full md:w-40 bg-white border text-primary-darker p-2 rounded hover:bg-primary-darker hover:text-white transition"
              >
                <FaCheckCircle className="inline mr-2" />
                Administrar feria
              </a>
              <a
                href="/admin/products"
                className="mb-5 w-full md:w-40 bg-white border text-primary-darker p-2 rounded hover:bg-primary-darker hover:text-white transition"
              >
                <FaCheckCircle className="inline mr-2" />
                Ver productos
              </a>
              <div className="flex gap-6">
                <div>
                  <h3 className="text-[#5E5F60] text-lg">Usuarios</h3>
                  <span className="text-2xl font-bold">
                    {userCounter.length}
                  </span>
                </div>
                <div>
                  <h3 className="text-[#5E5F60] text-lg">Vendedores</h3>
                  <span className="text-2xl font-bold">
                    {sellerCounter.length}
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
                className="w-full md:w-45 bg-white border text-primary-darker p-2 rounded hover:bg-primary-darker hover:text-white transition"
              >
                <FaCheckCircle className="inline mr-2" />
                Crear feria
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Historial de ferias */}
      <div className="row-span-3 mb-5 col-span-2 rounded-lg bg-[#f1fafa]">
        <div className="w-full h-full flex p-4 md:p-6 flex-col overflow-y-auto max-h-[600px] md:max-h-[900px]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h1 className="font-semibold text-primary-darker text-lg md:text-xl">
              Historial de ferias
            </h1>
            <input
              type="text"
              placeholder="Buscar feria por nombre..."
              className="p-2 pl-8 rounded-md border border-[#E5E9EB] text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredFairs.length > 0 ? (
            filteredFairs.map((fair) => (
              <div
                key={fair.id}
                className="shadow-lg flex flex-col font-semibold rounded-lg p-4 mt-4 bg-white"
              >
                <h3 className="text-lg border-b border-primary-default mb-2">
                  {fair.name}
                </h3>
                <span className="text-sm font-normal">
                  Estado: {fair.isActive ? "Activa" : "Cerrada"}
                </span>
                <span className="text-sm font-normal">
                  {fair.sellerRegistrations.length} vendedores
                </span>
                <span className="text-sm font-normal">
                  {fair.userRegistrations.length} usuarios
                </span>
                <span className="text-sm font-normal">
                  {fair.fairDays.length} días
                </span>

                {fair.fairCategories.map((category, index) => {
                  const sold = category.products.filter(p => p.status === "sold").length;
                  const unsold = category.products.filter(p => p.status === "unsold").length;
                  const clearance = category.products.filter(p => p.status === "soldOnClearance").length;

                  return (
                    <span key={index} className="text-sm block">
                      Categoría: {category.category.name}, {sold} vendidos, {unsold} no vendidos, {clearance} en liquidación
                    </span>
                  );
                })}

                <span className="text-sm font-bold mt-2">
                  Total vendidos:{" "}
                  {fair.fairCategories.reduce(
                    (acc, cat) =>
                      acc +
                      cat.products.filter(
                        (p) =>
                          p.status === "sold" ||
                          p.status === "soldOnClearance"
                      ).length,
                    0
                  )}
                </span>

                {isAdmin && !fair.isActive && (
                  <button
                    className="mt-3 w-fit bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDeleteFair(fair.id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))
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

