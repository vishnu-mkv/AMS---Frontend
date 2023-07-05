import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserSummary } from "@/interfaces/user";
import { useAtom } from "jotai";
import { authAtom } from "@/atoms/UserAtom";

function Profile() {
  const [showMenu, setShowMenu] = React.useState(false);
  const [auth, setAuth] = useAtom(authAtom);

  return (
    <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
      <DropdownMenuTrigger className="w-full mx-auto outline-none">
        <ProfileName user={auth.user!} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            // redirect to home
            window.location.href = "/auth/login";
            setAuth({ user: null, token: null });
            setShowMenu(false);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface UserAvatarProps {
  user: UserSummary;
  size?: "sm" | "md" | "xs";
  className?: string;
}

export function ProfileName({ user, size = "sm", className }: UserAvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 py-1 px-4 sm:pr-2 w-fit rounded-md m-auto sm:m-0 sm:w-auto ",
        className
      )}
    >
      <UserAvatar user={user} size={size} />
    </div>
  );
}

export function UserAvatar({ user, size = "sm", className }: UserAvatarProps) {
  const initials = (
    (user?.firstName[0] || "") + (user?.lastName[0] || "")
  ).toUpperCase();
  return (
    <Avatar
      className={cn(
        "rounded-sm",
        size === "md" ? "h-8 w-8" : "",
        size === "sm" ? "h-6 w-6" : "",
        size === "xs" ? "h-4 w-4" : "",
        className
      )}
    >
      <AvatarImage src={user?.picture || undefined} alt="" />
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  );
}

export default Profile;
