import { SessionSummary } from "@/interfaces/schedule";
import { getDayNames, toTitleCase } from "@/lib/utils";
import TopicItem from "../Topics/TopicItem";
import { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";

interface SessionItemProps {
  session: SessionSummary;
}

function SessionItem({ session }: SessionItemProps) {
  const days = useMemo(() => {
    const days = session.slots.map((s) => s.day);
    return [...new Set(days)];
  }, [session]);

  return (
    <div className="bg-terinary rounded-sm space-y-3 p-3 px-5 gap-10 w-full items-center min-w-[400px]">
      <TopicItem
        topic={
          session.topic || {
            id: "-1",
            name: "No topic",
            color: null,
          }
        }
      />
      <div className="flex gap-1 ml-5">
        {getDayNames(days).map((day) => (
          <Badge variant={"secondary"} key={session.id + "-" + day}>
            {toTitleCase(day)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default SessionItem;
