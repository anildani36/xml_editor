"use client";

import { CopyrightIcon } from "lucide-react";

export const AppFooter = () => {
  return (
    <footer className="w-full bg-black">
      <div className="mx-auto max-w-7xl flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
        <CopyrightIcon /> {new Date().getFullYear()} XML Editor. All rights reserved
      </div>
    </footer>
  );
}
