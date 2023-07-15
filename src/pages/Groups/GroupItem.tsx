import { GroupSummary } from "@/interfaces/user";
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
import { Badge } from "@/components/ui/Badge";
import ColorAvatar from "@/components/ColorAvatar";

interface GroupItemProps {
  group: GroupSummary;
}

function GroupItem({ group }: GroupItemProps) {
  return (
    <div className="bg-terinary rounded-sm flex p-3 px-5 gap-10 w-full items-center min-w-[400px]">
      <ColorAvatar color={group.color}></ColorAvatar>
      <div className="space-y-2 my-1">
        <Link to={`/groups/${group.id}`}>
          <span className="text-gray-800 font-medium text-[15px]">
            {toTitleCase(group.name)}
          </span>
        </Link>
        <div>
          <Badge variant={"secondary"}>
            {group.groupType === 0 ? "Group of Users" : "Group of Groups"}
          </Badge>
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
            <Link to={`/groups/${group.id}`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/groups/create?id=${group.id}`}>Edit</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default GroupItem;
