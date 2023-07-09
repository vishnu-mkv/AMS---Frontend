import Loading from "@/components/Loading";
import { UserAvatar } from "@/components/Profile";
import { ErrorMessage } from "@/components/ui/Alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAttendanceStatusQuery } from "@/features/api/attendanceSlice";
import { UserRecord } from "@/interfaces/attendance";
import { Group } from "@/interfaces/user";
import { toTitleCase } from "@/lib/utils";

type AttendanceViewerProps = {
  group: Group;
  attendance: UserRecord[];
} & (
  | {
      mode: "edit";
      onChanges: (changes: UserRecord[]) => void;
    }
  | {
      mode?: "view";
    }
);

function AttendanceViewer(props: AttendanceViewerProps) {
  const {
    data: attendanceStatus,
    isLoading: attendanceStatusLoading,
    error: attendanceStatusError,
  } = useGetAttendanceStatusQuery();

  if (attendanceStatusLoading) {
    return <Loading />;
  }
  if (attendanceStatusError) {
    return (
      <ErrorMessage
        error={attendanceStatusError}
        title="Something went wrong"
      />
    );
  }

  return (
    <div className="space-y-4">
      {props.group.users.map((u) => {
        const record = props.attendance.find((r) => r.user.id === u.id);
        return (
          <div
            className="flex gap-4 bg-slate-200 rounded-sm items-center p-2 justify-between"
            key={u.id}
          >
            <div className="flex items-center gap-2">
              <UserAvatar user={u}></UserAvatar>
              <h1 className="text-semibold">
                {toTitleCase(u.firstName + " " + u.lastName)}
              </h1>
            </div>
            <Select
              value={record?.attendanceStatusId}
              onValueChange={(value) => {
                if (props.mode !== "edit") return;
                const newRecords = structuredClone(props.attendance);
                let record = newRecords.find((r) => r.user.id === u.id);
                if (!record) {
                  record = {
                    user: u,
                    attendanceStatusId: value,
                    id: Date.now().toString(),
                  };
                  newRecords.push(record);
                }

                record.attendanceStatusId = value;

                console.log(newRecords);
                props.onChanges(newRecords);
              }}
            >
              <SelectTrigger
                className="w-[200px] ml-auto"
                disabled={props.mode !== "edit"}
              >
                <SelectValue placeholder="Select Status"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {attendanceStatus?.map((s) => (
                  <SelectItem key={`${u.id} - ${s.id}`} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
}

export default AttendanceViewer;
