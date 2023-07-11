import { ScheduleSummary } from "@/interfaces/schedule";
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

interface ScheduleItemProps {
  schedule: ScheduleSummary;
}

function ScheduleItem({ schedule }: ScheduleItemProps) {
  return (
    <div className="bg-terinary rounded-sm flex p-3 px-5 gap-10 w-full items-center min-w-[400px]">
      <div
        className="rounded-full w-10 h-10 bg-bgs"
        style={
          schedule.color
            ? {
                backgroundColor: schedule.color,
              }
            : {}
        }
      ></div>
      <div className="space-y-3 my-1">
        <Link to={`/schedules/${schedule.id}`}>
          <span className="text-gray-700">{toTitleCase(schedule.name)}</span>
        </Link>
        <div>
          <Badge variant={"secondary"}>{schedule.days.length} Days</Badge>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="ml-auto">
          <MoreHorizontal className="cursor-pointer h-5 w-5"></MoreHorizontal>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to={`/roles/${schedule.id}`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to={`/roles/${schedule.id}/edit`}>Edit</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ScheduleItem;
