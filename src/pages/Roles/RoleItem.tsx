import { roleSummary } from "@/interfaces/user";
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

interface RoleItemProps {
  role: roleSummary;
}

function RoleItem({ role }: RoleItemProps) {
  return (
    <div className="bg-terinary rounded-sm flex p-3 px-5 gap-10 w-full items-center min-w-[400px]">
      <div
        className="rounded-full w-10 h-10 bg-bgs"
        style={
          role.color
            ? {
                backgroundColor: role.color,
              }
            : {}
        }
      ></div>
      <div className="space-y-3 my-1">
        <Link to={`/roles/${role.id}`}>
          <span className="text-gray-700">{toTitleCase(role.name)}</span>
        </Link>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="ml-auto">
          <MoreHorizontal className="cursor-pointer h-5 w-5"></MoreHorizontal>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={`/roles/${role.id}`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/roles/create?id=${role.id}`}>Edit</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default RoleItem;
