import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { handleLogout } from "@/routes/auth";

export const DropdownWrapper = () => {

    return (
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
            <DropdownMenuItem>
                <Link href="/user/profile">
                    Profile
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Log Out
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}