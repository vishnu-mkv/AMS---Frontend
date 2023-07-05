import { UserSummary } from "@/interfaces/user";
import { UserAvatar } from "./Profile";
import { toTitleCase } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Badge } from "./ui/Badge";

interface UserItemProps {
  user: UserSummary;
}

function UserItem({ user }: UserItemProps) {
  return (
    <div className="bg-secondary/50 rounded-sm flex p-3 px-5 gap-10 w-full items-center">
      <UserAvatar
        user={user}
        size="md"
        className="rounded-none w-16 rounded-l-sm -mx-5 -my-3 h-[5.5rem]"
      ></UserAvatar>
      <div className="space-y-3 my-1">
        <span className="text-gray-700">
          {toTitleCase(user.firstName + " " + user.lastName)}
        </span>
        <div className="flex gap-2 flex-wrap grow">
          {user.roles.map((role, index) => (
            <Badge key={index} variant="default">
              {role.name}
            </Badge>
          ))}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="ml-auto">
          <MoreHorizontal className="cursor-pointer h-5 w-5"></MoreHorizontal>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to={`${user.id}/edit`}>Edit</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserItem;
