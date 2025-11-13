"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="flex justify-center mt-5">
      <div className="w-full max-w-screen-xl flex justify-center px-12">
        <img src="/placyhub.png" alt="PlacyHub Logo" className="w-50 h-auto" />
      </div>
    </header>
  );
}