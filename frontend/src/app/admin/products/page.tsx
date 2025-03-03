import AdminProducts from "@/components/Dashboard/Admin/AdminProducts";
import MainDashboardAdmin from "@/components/Dashboard/Admin/MainDashboardAdmin";
import React from "react";

const page = () => {
  return (
    <MainDashboardAdmin>
      <AdminProducts />
    </MainDashboardAdmin>
  );
};

export default page;
