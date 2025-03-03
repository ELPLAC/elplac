import AdminHome from "@/components/Dashboard/Admin/AdminHome";
import MainDashboardAdmin from "@/components/Dashboard/Admin/MainDashboardAdmin";
import React from "react";

const page = () => {
  return (
    <MainDashboardAdmin>
      <AdminHome />
    </MainDashboardAdmin>
  );
};

export default page;
