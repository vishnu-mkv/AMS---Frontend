import {
  SessionQueryProvider,
  useSessionQuery,
} from "../Attendance/SessionQueryContext";
import Header from "@/components/ui/header";
import { useListAttendanceQuery } from "@/features/api/attendanceSlice";
import { useMemo, useState } from "react";
import { AttendanceQuery } from "@/interfaces/attendance";
import moment from "moment";
import Loading from "@/components/Loading";
import { ErrorMessage } from "@/components/ui/Alert";
import RecordQuery from "./RecordQuery";
import { DataTable } from "@/components/data-table";
import { recordCols } from "./columns";

function RecordView() {
  return (
    <SessionQueryProvider>
      <div className="space-y-7">
        <Header title="View Records"></Header>
        <RecordQuery></RecordQuery>
        <RecordList />
      </div>
    </SessionQueryProvider>
  );
}

function RecordList() {
  const { state: queryState } = useSessionQuery();
  const [page, setPage] = useState(1);

  const query = useMemo(() => {
    const q: AttendanceQuery = {
      limit: 4,
      page,
    };

    if (queryState.date) {
      const date = queryState.date;
      q.StartDate = date[0] ? moment(date[0]).format("YYYY-MM-DD") : undefined;
      q.EndDate = date[1] ? moment(date[1]).format("YYYY-MM-DD") : undefined;
    } else {
      q.StartDate = undefined;
      q.EndDate = undefined;
    }

    if (queryState.sessions) {
      q.sessionId = queryState.sessions.map((s) => s.id);
    } else {
      q.sessionId = undefined;
    }

    if (queryState.topics) {
      q.topicId = queryState.topics.map((t) => t.id);
    } else {
      q.topicId = undefined;
    }

    if (queryState.schedule) {
      q.scheduleId = queryState.schedule.id;
    } else {
      q.scheduleId = undefined;
    }

    if (queryState.timeSlots) {
      q.timeSlotId = queryState.timeSlots.map((t) => t.id);
    } else {
      q.timeSlotId = undefined;
    }

    if (queryState.groups) {
      q.groupId = queryState.groups.map((g) => g.id);
    } else {
      q.groupId = undefined;
    }

    return q;
  }, [queryState, page]);

  const { data: records, isLoading, error } = useListAttendanceQuery(query);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="space-y-5">
      {/* <div className="grid gap-5 md:grid-cols-2">
        {records?.docs?.map((r) => {
          return <RecordItem record={r} />;
        })}
      </div>
      <Pagination
        page={records?.page || 1}
        totalPages={records?.totalPages || 1}
        setPage={(page) => {
          console.log(page);
          setPage(page);
        }}
      /> */}
      {records && (
        <DataTable
          columns={recordCols}
          data={records}
          onPageChange={(page) => {
            setPage(page);
          }}
        ></DataTable>
      )}
    </div>
  );
}

export default RecordView;
