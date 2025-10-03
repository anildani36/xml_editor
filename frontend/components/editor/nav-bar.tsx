"use client";

import Image from "next/image";
import { DropdownWrapper } from "./dropdown-wrapper";
import appLogo from "@/assets/app_logo.png";

export const Navbar = () => {
  return (
    <nav className="flex h-16 w-full items-center justify-between bg-black px-6 shadow-sm">
      {/* Left side branding */}
      
      <div className="flex items-center space-x-2 text-xl font-semibold tracking-tight text-white">
        <Image className="w-10 h-10 pr-2"
          src={appLogo} 
          alt="app logo"
        />
        XML Editor
      </div>

      {/* Right side avatar + dropdown */}
      <DropdownWrapper />
    </nav>
  );
}
