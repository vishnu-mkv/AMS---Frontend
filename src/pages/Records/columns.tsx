import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecordWithoutEntries } from "@/interfaces/attendance";
import { getTime } from "@/interfaces/schedule";
import { toTitleCase } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";

export const recordCols: ColumnDef<RecordWithoutEntries>[] = [
  {
    header: "Date",
    accessorKey: "recordedFor",
    cell: ({ row }) => moment(row.original.recordedFor).format("DD MMM YYYY"),
  },
  {
    header: "Group",
    accessorKey: "group.name",
  },
  {
    header: "Topic",
    cell: ({ row }) =>
      row.original.topic ? (
        <Link to={`/topics/${row.original.topic.id}`}>
          {toTitleCase(row.original.topic.name)}
        </Link>
      ) : (
        "-"
      ),
  },
  {
    header: "Slot",
    accessorKey: "slot.timeSlot",
    cell: ({ row }) =>
      row.original.slot.timeSlot ? getTime(row.original.slot.timeSlot) : "-",
  },
  {
    header: "Schedule",
    cell: ({ row }) =>
      row.original.schedule ? (
        <Link to={`/schedules/${row.original.schedule.id}`}>
          {toTitleCase(row.original.schedule.name)}
        </Link>
      ) : (
        "-"
      ),
  },
  //   {
  //     header: "Recorded On",
  //     accessorKey: "created",
  //     cell: ({ row }) => moment(row.original.created).format("DD MMM YYYY"),
  //   },
  {
    header: "Actions",
    cell: function ActionRow({ row }) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link target="_blank" to={`${row.original.id}`}>
                View
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
