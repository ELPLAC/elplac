/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import HeaderClient from "@/components/Header/HeaderClient";
import { ToastContainer } from "react-toastify";
import { ProfileImageProvider } from "@/context/ProfileProvider";
import { FairProvider } from "@/context/FairProvider";
import FooterClient from "@/components/Footer/FooterClient";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ELPLAC",
  description: "",
  icons: "/favicon.png",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Intro+Rust&display=swap"
          rel="stylesheet"
        />
         <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`${outfit.className} font-intro-rust`}>
        <AuthProvider>
          <FairProvider>
            <ProfileImageProvider>
              <HeaderClient />
              {children}
              <FooterClient />
            </ProfileImageProvider>
          </FairProvider>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}