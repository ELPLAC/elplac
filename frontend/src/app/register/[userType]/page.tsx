"use client";

import { RegisterView } from "@/components/RegisterView";
import { RegisterViewPageProps } from "@/types";
import React, { useState, useEffect } from "react";

const Page: React.FC<RegisterViewPageProps> = ({ params }) => {
  const [userType, setUserType] = useState<string | undefined>(undefined);

  useEffect(() => {
    params?.then((result) => setUserType(result.userType));
  }, [params]);

  return <RegisterView userTypeParam={userType || ""} />;
};
export default Page;