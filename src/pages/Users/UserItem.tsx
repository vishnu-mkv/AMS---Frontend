import { UserSummary } from "@/interfaces/user";
import { UserAvatar } from "../../components/Profile";
import { toTitleCase } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";

interface UserItemProps {
  user: UserSummary;
}

function UserItem({ user }: UserItemProps) {
  return (
    <div className="bg-terinary rounded-sm flex p-3 px-5 gap-5 md:gap-10 w-full items-center sm:min-w-[400px]">
      <UserAvatar
        user={user}
        size="md"
        className="rounded-full w-14 h-14"
      ></UserAvatar>
      <div className="space-y-3">
        <Link to={`/users/${user.id}`}>
          <span className="text-gray-800 font-medium text-[15px]">
            {toTitleCase(user.firstName + " " + user.lastName)}
          </span>
        </Link>
        <div className="flex gap-2 flex-wrap grow">
          {user.roles.map((role, index) => (
            <Badge key={index} variant="secondary">
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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={`/users/${user.id}`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/users/create?id=${user.id}`}>Edit</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserItem;
