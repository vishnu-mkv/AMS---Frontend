import SessionQuery from "./SessionQuery";
import Container from "@/components/Container";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/Button";
import { SessionQueryProvider, useSessionQuery } from "./SessionQueryContext";
import { useState } from "react";
import AttendanceRecorder from "./AttendanceRecorder";

function AttendanceTaker() {
  const [pageStae, setPageState] = useState<"select" | "record">("select");
  return (
    <SessionQueryProvider>
      {pageStae === "select" ? (
        <AttendanceSessionSelector changePage={setPageState} />
      ) : (
        <AttendanceRecorder changePage={setPageState} />
      )}
    </SessionQueryProvider>
  );
}

export interface AttendanceSelectorChildrenProps {
  changePage: (page: "select" | "record") => void;
}

function AttendanceSessionSelector({
  changePage,
}: AttendanceSelectorChildrenProps) {
  const { state: queryState } = useSessionQuery();

  const {
    schedule,
    timeSlots: timeSlot,
    date,
    groups: group,
    groupAccessPath,
    sessions: session,
  } = queryState;

  function handleGo() {
    if (
      !schedule ||
      !timeSlot ||
      !date ||
      !group ||
      !groupAccessPath ||
      !session
    )
      return;
    changePage("record");
  }

  return (
    <Container>
      <Header
        title="Record Attendance"
        subtitle="Select a session to continue"
      ></Header>
      <SessionQuery forAttendanceRecording={true} />
      {group && (
        <Button onClick={handleGo} width={"minWidth"} className="ml-auto mt-10">
          Go
        </Button>
      )}
    </Container>
  );
}

export default AttendanceTaker;
