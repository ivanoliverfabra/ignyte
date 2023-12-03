'use client'

// import { useState } from "react";
// import { Aside } from "./navbar/aside";
import { Navbar } from "./navbar/navbar";
import { Providers } from "./providers";
import { MobileNav } from "./navbar/mobile";
import { Notifications } from "../notifications";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  // const [isAsideOpen, setIsAsideOpen] = useState(false)
  return (
    <Providers>
      <main className="antialiased bg-background text-foreground-900 h-screen max-h-screen">
        <Navbar />
        {/* <Navbar aside={{ isAsideOpen, setIsAsideOpen }} /> */}
        {/* <Aside isOpen={isAsideOpen} /> */}
        <main className="p-4 h-auto">
          {children}
        </main>
        <Notifications />
        <MobileNav />
      </main>
    </Providers>
  );
}