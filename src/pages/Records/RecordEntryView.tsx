import { useGetAttendanceQuery } from "@/features/api/attendanceSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import AttendanceViewer from "../Attendance/AttendanceViewer";
import { useGetGroupQuery } from "@/features/api/groupSlice";
import Loading from "@/components/Loading";
import Header from "@/components/ui/header";
import { ErrorMessage } from "@/components/ui/Alert";
import { useParams } from "react-router";
import Container from "@/components/Container";

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
