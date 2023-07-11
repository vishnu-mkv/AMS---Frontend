import ColorBanner from "@/components/ColorBanner";
import Loading from "@/components/Loading";
import { ErrorMessage } from "@/components/ui/Alert";
import Header from "@/components/ui/header";
import { useGetScheduleQuery } from "@/features/api/scheduleSlics";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useParams } from "react-router";
import ScheduleTable from "./scheduleTable";
import { toTitleCase } from "@/lib/utils";

function ScheduleViewer() {
  const scheduleId = useParams().id || undefined;
  const {
    data: schedule,
    isLoading: scheduleLoading,
    error: scheduleError,
  } = useGetScheduleQuery(scheduleId || skipToken);

  if (scheduleLoading) return <Loading />;

  if (scheduleError) return <ErrorMessage error={scheduleError} />;

  return (
    <div>
      {schedule && (
        <div className="space-y-5">
          <ColorBanner className="">
            <Header
              title={toTitleCase(schedule.name)}
              className="text-white mb-2"
              subtitleClassName="text-white"
              subtitle={`${schedule.days.length} days / week`}
            ></Header>
          </ColorBanner>
          <ScheduleTable schedule={schedule} />
        </div>
      )}
    </div>
  );
}

export default ScheduleViewer;
