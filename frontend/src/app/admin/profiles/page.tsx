import AdminProfiles from "@/components/Dashboard/Admin/AdminProfiles";
import MainDashboardAdmin from "@/components/Dashboard/Admin/MainDashboardAdmin";
import React from "react";

const page = () => {
  return (
    <MainDashboardAdmin>
      <AdminProfiles />
    </MainDashboardAdmin>
  );
};

export default page;
