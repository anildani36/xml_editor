"use client";

import { cn } from "@/lib/utils"; // shadcn's cn utility
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  return (
    <nav className="flex h-16 w-full items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Left side branding */}
      <div className="text-xl font-semibold tracking-tight">🚀 MyApp</div>

      {/* Right side avatar + dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            )}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="user" />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
