"use client";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthenticatedUserContext } from "../contexts/AuthenticatedUserContext";
import napsesLogo from "./../../assets/images/napsesLogo.png"
import { useRouter } from "next/navigation";

export const Header = () => {
    const { user } = useContext(AuthenticatedUserContext);
    const [userName, setUserName] = useState<string>("Guest");
    const router = useRouter()
    useEffect(() => {
        setUserName(user?.fullName || "Guest")
    }, [user])

    return (
      <header className="bg-gray-800 text shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-xl font-bold">
            <Image
              className="hover:text-gray-400 cursor-pointer"
              src={napsesLogo}
              alt="Napses Logo"
              onClick={() => router.push("/")}
            />
          </div>
          <div>
            {user ? (
              <span className="text-sm font-medium">Hello, {userName}</span>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium bg-blue-500 py-2 px-4 rounded hover:bg-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    );
}