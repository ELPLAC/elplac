"use client";

import Sidebar from "../SidebarDashboard";
import { useProfile } from "@/context/ProfileProvider";
import { IMainDashboardAdmin } from "@/types";
import NavbarAdmin from "@/components/NavbarAdmin";
import "./adminPostFair.css"


const MainDashboardAdmin: React.FC<IMainDashboardAdmin> = ({ children }) => {
  const { userDtos } = useProfile();

  return (
    <div>
      <div className="w-full h-32 flex items-center ">
        <NavbarAdmin />
      </div>
      <div>
        <main className="grid grid-cols-4 sm:grid-cols-8 gap-0 relative place-content-center ">
          <div className="bg-secondary-lighter h-full col-span-1 sidebaritemsdiv">
            <Sidebar userRole={userDtos?.role} />
          </div>
          <div className="col-span-7 bg-primary-lighter">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainDashboardAdmin;
