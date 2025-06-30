"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import MainDashboard from "@/components/Dashboard/MainDashboard";
import { parseJwt } from "@/lib/jwt"; // Asegúrate de tener esta función

interface Fair {
  id: string;
  name: string;
  isActive: boolean;
}

function DashboardPage() {
  const [fairs, setFairs] = useState<Fair[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchFairs = async () => {
    try {
      const res = await axios.get("/api/fairs");
      setFairs(res.data);
    } catch (error) {
      console.error("Error fetching fairs", error);
    }
  };

  const checkAdmin = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      setIsAdmin(payload?.role === "ADMIN");
    }
  };

  const deleteFair = async (id: string) => {
    const confirmDelete = confirm("¿Eliminar esta feria definitivamente?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/fairs/history/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Feria eliminada.");
      fetchFairs();
    } catch (error) {
      console.error("Error al eliminar feria.", error);
      alert("Error al eliminar feria.");
    }
  };

  useEffect(() => {
    checkAdmin();
    fetchFairs();
  }, []);

  return (
    <div className="p-4">
      <MainDashboard />

      <h2 className="text-2xl font-semibold mt-10 mb-4">Ferias concluidas</h2>
      <div className="space-y-3">
        {fairs
          .filter((fair) => !fair.isActive)
          .map((fair) => (
            <div
              key={fair.id}
              className="p-4 border rounded-md flex justify-between items-center bg-white shadow-sm"
            >
              <span className="text-lg font-medium">{fair.name}</span>

              {isAdmin && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => deleteFair(fair.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default DashboardPage;

