'use client';

import { useEffect, useState } from 'react';
import { getUserInfo } from '@/utils/userInfo';
import { IUser } from '@/types/types';
import Navbar from '../Navbar/Navbar';
import Dashboard from './Dashboard';
import DashboardSeller from './DashboardSeller';
import MainDashboardAdmin from './MainDashboardAdmin';

export default function MainDashboard() {
  const [userDtos, setUserDtos] = useState<IUser | null>(null);

  const fetchData = async () => {
    const user = await getUserInfo();
    setUserDtos(user);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!userDtos) {
    return (
      <div>
        <div className="w-full h-32 flex items-center">
          <Navbar />
        </div>
        <div className="text-center mt-10 text-gray-500">Cargando datos de usuario...</div>
      </div>
    );
  }

  if (userDtos?.role === "seller") {
    return (
      <div>
        <div className="w-full h-32 flex items-center">
          <Navbar />
        </div>
        <DashboardSeller />
      </div>
    );
  }

  if (userDtos?.role === "admin") {
    return (
      <div>
        <div className="w-full h-32 flex items-center">
          <Navbar />
        </div>
        <MainDashboardAdmin />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full h-32 flex items-center">
        <Navbar />
      </div>
      <Dashboard />
    </div>
  );
}

