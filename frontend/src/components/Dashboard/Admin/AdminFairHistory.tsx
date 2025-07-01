"use client";
import React, { useState } from "react";
import { useFair } from "@/context/FairProvider";
import { useAuth } from "@/context/AuthProvider";
import { notify } from "@/components/Notifications/Notifications";
import { URL } from "../../../envs";

const AdminFairHistory = () => {
  const { pastFairs, setActiveFair } = useFair();
  const { token } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDeleteFair = async (id: string) => {
    const confirmDelete = window.confirm("¿Seguro que querés eliminar esta feria? Esta acción es irreversible.");
    if (!confirmDelete) return;

    try {
      setLoadingId(id);
      const response = await fetch(`${URL}/fairs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al eliminar feria");
      }

      notify("ToastSuccess", "Feria eliminada correctamente");
      // Opcional: podés recargar la página o actualizar estado global
      setActiveFair(undefined); // por si justo era la feria activa
    } catch (error) {
      console.error(error);
      notify("ToastError", "No se pudo eliminar la feria");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary-darker mb-4">Historial de Ferias</h2>
      {pastFairs.length === 0 ? (
        <p className="text-gray-600">No hay ferias concluidas aún.</p>
      ) : (
        <div className="space-y-4">
          {pastFairs.map((fair) => (
            <div
              key={fair.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-primary-dark">{fair.name}</h3>
                <p className="text-sm text-gray-500">{fair.address}</p>
              </div>
              <button
                onClick={() => handleDeleteFair(fair.id)}
                disabled={loadingId === fair.id}
                className={`text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition ${
                  loadingId === fair.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                🗑 Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFairHistory;