"use client";

import React, { useEffect, useState } from "react";
import MainDashboard from "@/components/Dashboard/MainDashboard";
import MainDashboardAdmin from "@/components/Dashboard/MainDashboardAdmin";
import MainDashboardSeller from "@/components/Dashboard/MainDashboardSeller";
import { parseJwt } from "@/lib/jwt"; // Asegúrate de tener esta función

function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      setRole(payload?.role || null);
    }
  }, []);

  if (!role) {
    return <p className="p-6">Cargando dashboard...</p>;
  }

  if (role === "ADMIN" || role === "admin") {
    return <MainDashboardAdmin />;
  }

  if (role === "SELLER" || role === "seller") {
    return <MainDashboardSeller />;
  }

  return <MainDashboard />;
}

export default DashboardPage;


