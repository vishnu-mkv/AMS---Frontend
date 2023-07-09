import {
  SessionQueryProvider,
  useSessionQuery,
} from "../Attendance/SessionQueryContext";
import SessionQuery from "../Attendance/SessionQuery";
import Header from "@/components/ui/header";

function RecordView() {
  return (
    <SessionQueryProvider>
      <RecordViewer></RecordViewer>
    </SessionQueryProvider>
  );
}

function RecordViewer() {
  const { state: queryState } = useSessionQuery();
  return (
    <div>
      <Header title="View Records"></Header>
      <SessionQuery></SessionQuery>
    </div>
  );
}

export default RecordView;
