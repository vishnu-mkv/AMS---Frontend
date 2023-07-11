import { GroupSummary, UserSummary } from "./user";
import moment from "moment";

type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ScheduleSummary {
  id: string;
  name: string;
  color: string;
  days: Day[];
}

export interface TopicSummary {
  id: string;
  name: string;
  color: string | null;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

function parseTime(timeString: string): string {
  return moment(timeString, "HH:mm:ss").format("hh:mm A");
}

export function getTime(timeSlot: TimeSlot): string {
  // startTime and endTime are in the format HH:mm:ss
  // We only want to display HH:mm
  return `${parseTime(timeSlot.startTime)} - ${parseTime(timeSlot.endTime)}`;
}

export interface Slot {
  id: string;
  timeSlotId: string;
  day: Day;
  timeSlot: TimeSlot | null;
}

export interface SessionSummary {
  id: string;
  slots: Slot[];
  topicId: string | null;
  topic: TopicSummary | null;
}

export interface Session extends SessionSummary {
  groups: GroupSummary[];
  attendanceTakers: UserSummary[];
}

export interface Schedule extends ScheduleSummary {
  timeSlots: TimeSlot[];
  sessions: Session[];
}
