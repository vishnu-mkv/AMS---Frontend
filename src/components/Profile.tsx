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
import { useGetMyScheduleQuery } from "@/features/api/scheduleSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import ScheduleViewer from "@/pages/Schedules/ScheduleViewer";
import Loading from "./Loading";
import { ErrorMessage } from "./ui/Alert";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Icon } from "@iconify/react/dist/iconify.js";

function Profile() {
  const [showMenu, setShowMenu] = React.useState(false);
  const [auth, setAuth] = useAtom(authAtom);

  return (
    <Dialog>
      <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
        <DropdownMenuTrigger className="w-full mx-auto outline-none">
          <ProfileName user={auth.user!} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger>
            <DropdownMenuItem>
              <Icon icon="uim:schedule" className="mr-2 h-4 w-4"></Icon>
              My Schedule
            </DropdownMenuItem>
          </DialogTrigger>
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
      <DialogContent>
        <MyScheduleViewer />
      </DialogContent>
    </Dialog>
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

function MyScheduleViewer() {
  const [{ user }] = useAtom(authAtom);

  const {
    data: mySchedule,
    isLoading,
    error,
  } = useGetMyScheduleQuery(user?.scheduleId ? undefined : skipToken);

  if (isLoading) return <Loading />;

  if (error) return <ErrorMessage error={error} />;

  return <ScheduleViewer schedule={mySchedule} />;
}

export default Profile;
