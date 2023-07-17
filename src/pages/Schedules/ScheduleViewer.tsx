import ColorBanner from "@/components/ColorBanner";
import Loading from "@/components/Loading";
import { ErrorMessage } from "@/components/ui/Alert";
import Header from "@/components/ui/header";
import { useGetScheduleQuery } from "@/features/api/scheduleSlice";
import { useParams } from "react-router";
import ScheduleTable from "./scheduleTable";
import { toTitleCase } from "@/lib/utils";
import { Schedule } from "@/interfaces/schedule";

function ScheduleViewer({ schedule: _schedule }: { schedule?: Schedule }) {
  const scheduleId = useParams().id || undefined;
  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    error: scheduleError,
  } = useGetScheduleQuery(scheduleId ?? "", {
    skip: !scheduleId || !!_schedule,
  });

  if (scheduleLoading) return <Loading />;

  if (scheduleError) return <ErrorMessage error={scheduleError} />;

  const schedule = _schedule || scheduleData;

  return (
    <div>
      {schedule && (
        <div className="space-y-5">
          <ColorBanner color={schedule.color}>
            <Header
              title={toTitleCase(schedule.name)}
              className="text-white mb-2"
              subtitleClassName="text-white"
              subtitle={`${schedule.days.length} days / week`}
              editUrl={`/schedules/create?id=${schedule.id}`}
            ></Header>
          </ColorBanner>
          <ScheduleTable schedule={schedule} />
        </div>
      )}
    </div>
  );
}

export default ScheduleViewer;
