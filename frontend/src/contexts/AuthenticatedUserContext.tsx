"use client";
import { useRouter } from "next/router";
import React, { FC, useEffect, useMemo, useState } from "react";

interface AuthenticatedUserProviderType {
  children: React.ReactNode;
}

export interface AuthenticatedUserType {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  token: string;
}

export interface AuthenticatedUserContextType {
  user: AuthenticatedUserType | null;
  handleAuthenticationDetails: (user: AuthenticatedUserType | null) => void;
}

export const AuthenticatedUserContext = React.createContext<AuthenticatedUserContextType>({
  user: null,
  handleAuthenticationDetails: () => {}
});

export const AuthenticatedUserProvider: FC<AuthenticatedUserProviderType> = ({ children }) => {
  const [user, setAuthenticatedUser] = useState<AuthenticatedUserType | null>(null);

  const handleAuthenticationDetails = (user: AuthenticatedUserType | null) => {
    if (user) {
      localStorage.setItem("userDetails", JSON.stringify(user));
    } else {
      localStorage.removeItem("userDetails");
      localStorage.removeItem("user");
    }
    setAuthenticatedUser(user);
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userDetails");
      if (storedUser) {
        const parsedUser: AuthenticatedUserType = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id && parsedUser.fullName ) {
          setAuthenticatedUser(parsedUser);
        } else {
          console.warn("Invalid user details found in localStorage.");
          localStorage.removeItem("userDetails"); 
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      localStorage.removeItem("userDetails"); 
      localStorage.removeItem("user");
    }
  }, []);
  

  const providerValue = useMemo(() => {
    return { user, handleAuthenticationDetails };
  }, [user]);

  return (
    <AuthenticatedUserContext.Provider value={providerValue}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
