"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import HeaderTerms from "./HeaderTerms";

function HeaderClient() {
  const pathname = usePathname();

  if (pathname === "/terms&conditions") {
    return <HeaderTerms />;
  } else if (
    pathname === "/dashboard" ||
    pathname === "/dashboard/profile" ||
    pathname === "/help" ||
    pathname === "/dashboard/changeType" ||
    pathname === "/dashboard/fairs" ||
    pathname === "/dashboard/products" ||
    pathname === "/admin" ||
    pathname === "/admin/products" ||
    pathname === "/admin/fairs" ||
    pathname === "/admin/postFair" ||
    pathname === "/admin/profiles"
  ) {
    return null;
  }
  return <Header />;
}

export default HeaderClient;
