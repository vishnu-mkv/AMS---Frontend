import { Session } from "@/interfaces/schedule";
import { getDayNames, toTitleCase } from "@/lib/utils";
import { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import ColorAvatar from "@/components/ColorAvatar";
import { useAtom } from "jotai";
import { authAtom } from "@/atoms/UserAtom";

interface SessionItemProps {
  session: Session;
  showCanTakeAttendance?: boolean;
}

function SessionItem({ session, showCanTakeAttendance }: SessionItemProps) {
  const days = useMemo(() => {
    const days = session.slots.map((s) => s.day);
    return [...new Set(days)];
  }, [session]);

  const [auth] = useAtom(authAtom);

  return (
    <div className="bg-terinary rounded-sm space-y-5 p-3 px-5 gap-10 w-full items-center sm:min-w-[400px]">
      <div className="flex gap-4 md:gap-8 items-center py-4 border-b border-b-slate-300 flex-wrap">
        <ColorAvatar color={session.topic?.color}></ColorAvatar>
        <div className="text-gray-700">
          {session.topic?.name || "Unknown Topic"}
        </div>
        {showCanTakeAttendance &&
          session.attendanceTakers.find((at) => at.id === auth.user?.id) && (
            <Badge variant={"success"} className="ml-10">
              You can take attendance
            </Badge>
          )}
      </div>
      <div className="grid grid-cols-[60px_auto] gap-5">
        <span className="text-sm text-gray-500">Groups : </span>
        <div className="flex gap-1">
          {session.groups.map((g) => (
            <Badge key={session.id + "-" + g.name}>{toTitleCase(g.name)}</Badge>
          ))}
        </div>

        <span className="text-sm text-gray-500">Days : </span>
        <div className="flex gap-2 flex-wrap">
          {getDayNames(days).map((day) => (
            <Badge variant={"secondary"} key={session.id + "-" + day}>
              {toTitleCase(day)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SessionItem;
