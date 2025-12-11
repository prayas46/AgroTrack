"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

type SessionProviderProps = {
  children: ReactNode;
};

export function AuthSessionProvider({ children }: SessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
