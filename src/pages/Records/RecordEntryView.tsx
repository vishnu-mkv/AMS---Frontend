import { useGetAttendanceQuery } from "@/features/api/attendanceSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import AttendanceViewer from "../Attendance/AttendanceViewer";
import { useGetGroupQuery } from "@/features/api/groupSlice";
import Loading from "@/components/Loading";
import Header from "@/components/ui/header";
import { ErrorMessage } from "@/components/ui/Alert";
import { useParams } from "react-router";
import Container from "@/components/Container";
import { Badge } from "@/components/ui/Badge";
import { CalendarIcon, TimerIcon } from "lucide-react";
import moment from "moment";
import { getTime } from "@/interfaces/schedule";
import { Icon } from "@iconify/react/dist/iconify.js";

function RecordEntryView() {
  const params = useParams();
  const attendanceId = params["id"] || undefined;
  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useGetAttendanceQuery(attendanceId ? attendanceId : skipToken);

  const {
    data: group,
    isLoading: groupLoading,
    error: groupError,
  } = useGetGroupQuery(attendanceData?.group.id || skipToken);

  if (attendanceLoading || groupLoading) return <Loading />;

  return (
    <Container>
      <Header title="Attendance Record" />
      {(attendanceError || groupError) && (
        <ErrorMessage
          title="Something went wrong"
          error={attendanceError || groupError}
        />
      )}
      {attendanceData && (
        <div className="flex gap-4 flex-wrap">
          <Badge variant={"secondary"} className="text-sm">
            <CalendarIcon size="16" className="mr-2"></CalendarIcon>
            {moment(attendanceData.recordedFor).format("DD MMM YYYY")}
          </Badge>
          {attendanceData.slot.timeSlot && (
            <Badge variant={"secondary"} className="text-sm">
              <TimerIcon size="16" className="mr-2"></TimerIcon>
              {getTime(attendanceData.slot.timeSlot)}
            </Badge>
          )}
          {attendanceData.topic && (
            <Badge variant={"secondary"} className="text-sm">
              <Icon
                icon="icon-park-solid:topic-discussion"
                className="mr-2"
              ></Icon>
              {attendanceData.topic?.name}
            </Badge>
          )}
          {attendanceData?.group?.name && (
            <Badge variant={"secondary"} className="text-sm">
              <Icon icon={"mdi:account-group"} className="mr-2"></Icon>
              {attendanceData.group.name}
            </Badge>
          )}
        </div>
      )}
      {group && (
        <AttendanceViewer
          mode="view"
          group={group}
          attendance={attendanceData?.records || []}
        />
      )}
    </Container>
  );
}

export default RecordEntryView;
