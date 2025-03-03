"use client";

import ForgotPassStep2 from "@/components/ForgotPassStep2";
import { ForgotPasswordProps } from "@/types";
import { FC, useEffect, useState } from "react";

const Page: FC<ForgotPasswordProps> = ({ params }) => {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    params?.then((result) => {
      setToken(result.token);
    });
  }, [params]);

  return (
    <div>
      {token && <ForgotPassStep2 token={token} />}
    </div>
  );
};

export default Page;

