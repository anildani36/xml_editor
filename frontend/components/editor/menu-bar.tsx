"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { menus } from "@/schemas/dropdwon_menu_schemas";

export const MenuBar = () => {
  return (
    <nav className="flex w-full h-10 items-center border-b bg-gray-100 px-2 text-sm text-black space-x-2">
      {menus.map((menu) => (
        <DropdownMenu key={menu.label}>
          {/* Menu title */}
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="font-medium hover:bg-gray-200"
            >
              {menu.label}
            </Button>
          </DropdownMenuTrigger>

          {/* Dropdown items */}
          <DropdownMenuContent align="start" className="w-48">
            {menu.items.map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={item.onClick}
                className="cursor-pointer"
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </nav>
  );
};
