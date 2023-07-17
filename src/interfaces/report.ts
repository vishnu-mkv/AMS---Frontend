import { AttendanceStatus } from "./attendance";
import { TimeSlot, TopicSummary } from "./schedule";
import { Group, GroupSummary, UserSummary } from "./user";

export interface GroupReport {
  group: Group;
  dayReports: DayReport[];
  timeSlots: TimeSlot[];
  attendanceStatuses: AttendanceStatus[];
  userReports: UserReport[];
}

interface UserReport {
  user: UserSummary;
  dayReports: DayReport[];
}

interface DayReport {
  date: string;
  timeSlotReports: TimeSlotReport[];
}

interface TimeSlotReport {
  timeSlotId: string;
  attendanceStatusCounts: AttendanceStatusCount[];
}

interface AttendanceStatusCount {
  attendanceStatusId: string;
  count?: number | null;
}

export interface AttendanceReportQuery {
  startDate?: string | null;
  endDate?: string | null;
  groupId: string;
  topicIds?: string[] | null;
  timeSlotIds?: string[] | null;
  days?: number[] | null;
  attendanceStatusIds?: string[] | null;
  isUserReport?: boolean | null;
}

export interface AttendanceReportQueryForm {
  startDate?: Date;
  endDate?: Date;
  group?: GroupSummary;
  topics?: TopicSummary[];
  timeSlots?: TimeSlot[];
  attendanceStatuses?: AttendanceStatus[];
  days?: number[];
}
