"use client";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from "../contexts/AuthenticatedUserContext";
import { Footer } from "../templates/footer.template";
import { Header } from "../templates/header.template";
import "./../../assets/styles/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <AuthenticatedUserProvider>
          <div className="w-1/4"></div>
          <div className="w-1/2 flex flex-col overflow-hidden mt-5 mb-5">
            <Header />
            <div className="flex-grow overflow-auto">
              {children}
            </div>
            <Footer />
          </div>
          <div className="w-1/4"></div>
        </AuthenticatedUserProvider>
      </body>
    </html>
  );
}
