import React, { Suspense } from "react";
import AuthSuccess from "./AuthSuccess";

const AuthSuccessWrapper = () => (
  <Suspense fallback={<div></div>}>
    <AuthSuccess />
  </Suspense>
);

export default AuthSuccessWrapper;
