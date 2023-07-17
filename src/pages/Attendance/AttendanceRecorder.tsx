import Loading from "@/components/Loading";
import { ErrorMessage, Message } from "@/components/ui/Alert";
import Header from "@/components/ui/header";
import {
  useAddAttendanceMutation,
  useGetAttendanceQuery,
  useListAttendanceQuery,
  useUpdateAttendanceMutation,
} from "@/features/api/attendanceSlice";
import { getTime } from "@/interfaces/schedule";
import AttendanceViewer from "./AttendanceViewer";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { AddAttendance, UserRecord } from "@/interfaces/attendance";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/Button";
import moment from "moment";
import { Badge } from "@/components/ui/Badge";
import { CalendarIcon, ChevronLeft, TimerIcon } from "lucide-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SessionQueryState, useSessionQuery } from "./SessionQueryContext";
import { AttendanceSelectorChildrenProps } from "./AttendanceTaker";

function AttendanceRecorder({ changePage }: AttendanceSelectorChildrenProps) {
  const { state } = useSessionQuery();

  if (
    !state.sessions ||
    !state.groups ||
    !state.date ||
    !state.timeSlots ||
    !state.schedule
  ) {
    return (
      <ErrorMessage
        error="This page cannot be viewed"
        title="Something went wrong"
      />
    );
  }

  return (
    <_AttendanceRecorder
      state={state as any}
      changePage={changePage}
    ></_AttendanceRecorder>
  );
}

function _AttendanceRecorder({
  state,
  changePage,
}: {
  state: Required<SessionQueryState>;
} & AttendanceSelectorChildrenProps) {
  const {
    schedule,
    timeSlots,
    date: dates,
    groups,
    groupAccessPath,
    sessions,
  } = state;

  const timeSlot = timeSlots[0];
  const group = groups[0];
  const session = sessions[0];
  const date = dates[0];
  const topic = session.topic;

  const {
    data: recordData,
    isLoading: recordLoading,
    error: recordError,
  } = useListAttendanceQuery({
    sessionId: [session.id],
    groupId: [groups[0].id],
    RecordedForDate: moment(date).format("YYYY-MM-DD"),
    timeSlotId: [timeSlots[0].id],
    scheduleId: schedule.id,
  });

  const [attendanceId, setAttendanceId] = useState<string>("");
  const editMode = attendanceId !== "";

  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useGetAttendanceQuery(editMode ? attendanceId : skipToken);

  const [attendanceRecords, setAttendanceRecords] = useState<UserRecord[]>([]);

  useEffect(() => {
    if (attendanceData) {
      setAttendanceRecords(attendanceData.records);
    }
  }, [attendanceData]);

  useEffect(() => {
    if (!recordData || recordData.docs.length === 0) return;
    setAttendanceId(recordData.docs[0].id);
  }, [recordData]);

  const [
    updateAttendance,
    { data: updateData, error: updateError, isLoading: updateLoading },
  ] = useUpdateAttendanceMutation();
  const [
    addAttendance,
    { data: addData, error: addError, isLoading: addLoading },
  ] = useAddAttendanceMutation();

  function handleSubmit() {
    const attendanceEntries = attendanceRecords.map((record) => {
      return {
        userId: record.user.id,
        attendanceStatusId: record.attendanceStatusId,
      };
    });

    if (editMode) {
      console.log("update", attendanceId);
      if (!attendanceId) return;
      updateAttendance({
        AttendanceId: attendanceId,
        attendanceEntries,
        groupAccessPath: groupAccessPath.map((g) => g.id),
      });
    } else {
      const data: AddAttendance = {
        sessionId: session.id,
        groupId: group.id,
        date: moment(date).format("YYYY-MM-DD"),
        timeSlotId: timeSlot.id,
        scheduleId: schedule.id,
        attendanceEntries,
        groupAccessPath: groupAccessPath.map((g) => g.id),
      };
      addAttendance(data);
    }
  }

  useEffect(() => {
    if (!addData) return;
    setAttendanceId(addData.id);
  }, [addData]);

  const error = recordError || attendanceError || updateError || addError;

  return (
    <Container className="md:pl-11">
      <div className="flex gap-5 items-center md:-ml-11">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => {
            changePage("select");
          }}
        ></ChevronLeft>
        <Header title="Mark Attendance" subtitle={group.name}></Header>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge className="!mt-0">
          Status :{" "}
          {editMode
            ? "Editing"
            : attendanceRecords.length === 0
            ? "Not Started"
            : "Started"}
        </Badge>
        <Badge variant={"secondary"} className="text-sm">
          <CalendarIcon size="16" className="mr-2"></CalendarIcon>
          {moment(date).format("DD MMM YYYY")}
        </Badge>
        <Badge variant={"secondary"} className="text-sm">
          <TimerIcon size="16" className="mr-2"></TimerIcon>
          {getTime(timeSlot)}
        </Badge>
        {topic && (
          <Badge variant={"secondary"} className="text-sm">
            <Icon
              icon="icon-park-solid:topic-discussion"
              className="mr-2"
            ></Icon>
            {topic?.name}
          </Badge>
        )}
      </div>
      <ErrorMessage error={error} title={"Something went wrong"}></ErrorMessage>
      {!error && (
        <Message
          message={updateData || addData ? "Success" : ""}
          title={
            updateData
              ? "Attendance updated"
              : addData
              ? "Attendance added"
              : ""
          }
        ></Message>
      )}
      {(recordLoading || attendanceLoading) && <Loading />}
      {!recordLoading && recordData && (
        <AttendanceViewer
          mode="edit"
          group={group}
          attendance={attendanceRecords}
          onChanges={setAttendanceRecords}
        />
      )}
      <div className="flex justify-between gap-5">
        <Button variant={"outline"} onClick={() => changePage("select")}>
          Go Back
        </Button>
        <Button
          onClick={handleSubmit}
          loader={{
            loading: updateLoading || addLoading,
            text: editMode ? "Updating" : "Saving",
          }}
        >
          Save Records
        </Button>
      </div>
    </Container>
  );
}

export default AttendanceRecorder;
