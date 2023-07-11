import { RecordWithoutEntries } from "@/interfaces/attendance";
import { toTitleCase } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import ColorAvatar from "@/components/ColorAvatar";
import moment from "moment";
import { getTime } from "@/interfaces/schedule";
import { Link } from "react-router-dom";

interface RecordItemProps {
  record: RecordWithoutEntries;
}

function RecordItem({ record }: RecordItemProps) {
  return (
    <Link
      to={record.id}
      className="bg-terinary rounded-sm space-y-5 p-3 px-5 gap-10 w-full items-center min-w-[400px]"
    >
      <div className="flex gap-8 items-center py-4 border-b border-b-slate-300 flex-wrap">
        <ColorAvatar color={record.session.topic?.color}></ColorAvatar>
        <div className="text-gray-700">
          {record.session.topic?.name || "Unknown Topic"}
        </div>
      </div>
      <div className="grid grid-cols-[100px_max-content_100px_max-content] gap-x-10 gap-y-5">
        <span className="text-sm text-gray-500">Recorded For : </span>

        <Badge variant={"default"}>
          {moment(record.recordedFor).format("DD-MM-YYYY")}
        </Badge>
        {record.slot.timeSlot && (
          <>
            <span className="text-sm text-gray-500">Time Slot : </span>

            <Badge variant={"default"}>{getTime(record.slot.timeSlot)}</Badge>
          </>
        )}
        <span className="text-sm text-gray-500">Group : </span>

        <Badge key={record.id + "-" + record.group.name} variant={"secondary"}>
          {toTitleCase(record.group.name)}
        </Badge>

        <span className="text-sm text-gray-500">Schedule : </span>

        <Badge variant={"secondary"}>{record.schedule.name}</Badge>
      </div>
    </Link>
  );
}

export default RecordItem;
