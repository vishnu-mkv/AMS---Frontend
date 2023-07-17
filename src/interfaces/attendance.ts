import { PaginatedQuery } from "./common";
import { ScheduleSummary, Slot, TopicSummary } from "./schedule";
import { GroupSummary, UserSummary } from "./user";

export interface AttendanceStatus {
  id: string;
  name: string;
  shortName: string;
  color: string;
  organizationId: string;
}

export interface AttendanceQuery extends PaginatedQuery {
  scheduleId?: string;
  RecordedForDate?: string;
  sessionId?: string[];
  timeSlotId?: string[];
  groupId?: string[];
  attendanceTakerId?: string;
  StartDate?: string;
  EndDate?: string;
  topicId?: string[];
}

export interface RecordSummary {
  id: string;
  recordedForDate: Date;
  topicId: string;
  created: Date;
  group: GroupSummary;
  scheduleId: string;
  slot: Slot;
}

export interface RecordWithoutEntries {
  id: string;
  recordedFor: string;
  schedule: ScheduleSummary;
  created: string;
  topic: TopicSummary;
  group: GroupSummary;
  slot: Slot;
}

export interface UserRecord {
  id: string;
  user: UserSummary;
  attendanceStatusId: string;
}

export interface Record {
  id: string;
  schedule: ScheduleSummary;
  recordedFor: Date;
  created: Date;
  topic: TopicSummary;
  group: GroupSummary;
  slot: Slot;
  records: UserRecord[];
}

export interface AttendanceEntry {
  userId: string;
  attendanceStatusId: string;
}

export interface AddAttendance {
  scheduleId: string;
  sessionId: string;
  groupId: string;
  timeSlotId: string;
  groupAccessPath: string[];
  attendanceEntries: AttendanceEntry[];
  date: string;
}

export type updateAttendance = Pick<
  AddAttendance,
  "attendanceEntries" | "groupAccessPath"
> & {
  AttendanceId: string;
};
