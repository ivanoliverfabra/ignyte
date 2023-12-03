'use client'

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "../ui/tooltip";
import { AblyProvider } from 'ably/react'
import { client } from "@/lib/ably";

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
        <TooltipProvider>
          <AblyProvider client={client}>
            {children}
          </AblyProvider>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}