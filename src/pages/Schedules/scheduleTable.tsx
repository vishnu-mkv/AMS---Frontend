import { Schedule, Session, TimeSlot, getTime } from "@/interfaces/schedule";
import { getDayNames } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

interface scheduleTableProps {
  schedule: Schedule;
}

interface SlotData {
  timeSlot: TimeSlot;
  sessions: Session[];
  activeIndex: number;
}

type TableData = SlotData[][];

function ScheduleTable({ schedule }: scheduleTableProps) {
  // day index - hash map of day to index

  const DayIndex = useMemo(() => {
    const dayIndex: Map<number, number> = new Map();
    for (let i = 0; i < schedule.days.length; i++) {
      dayIndex.set(schedule.days[i], i);
    }
    return dayIndex;
  }, [schedule.days]);

  // time slot index - hash map of time slot id to index

  const TimeSlotIndex = useMemo(() => {
    const timeSlotIndex: Map<string, number> = new Map();
    for (let i = 0; i < schedule.timeSlots.length; i++) {
      timeSlotIndex.set(schedule.timeSlots[i].id, i);
    }
    return timeSlotIndex;
  }, [schedule.timeSlots]);

  const [tableData, setTableData] = useState<TableData>([]);

  useEffect(() => {
    const tableData: TableData = [];

    // each index represents a day in the schedule.days
    // each day has an array of slots - the number of slots is equal to the number of time slots in the schedule
    // each slot has an array of sessions - the number of sessions is equal to the number of sessions in the schedule corresponding to the time slot

    // create array and fill it with all timeslots empty sessions
    for (let i = 0; i < schedule.days.length; i++) {
      tableData[i] = [];
      for (let j = 0; j < schedule.timeSlots.length; j++) {
        tableData[i][j] = {
          timeSlot: schedule.timeSlots[j],
          sessions: [],
          activeIndex: 0,
        };
      }
    }

    // fill the array with the sessions
    for (let i = 0; i < schedule.sessions.length; i++) {
      // for each slot the session is in, add the session to the slot
      const session = schedule.sessions[i];
      for (let j = 0; j < session.slots.length; j++) {
        const slot = session.slots[j];
        const dayIndex = DayIndex.get(slot.day);
        const timeSlot = schedule.timeSlots.find(
          (timeSlot) => timeSlot.id === slot.timeSlotId
        );
        if (timeSlot === undefined) continue;
        const timeSlotIndex = TimeSlotIndex.get(timeSlot.id);
        if (timeSlotIndex === undefined || dayIndex === undefined) continue;
        tableData[dayIndex][timeSlotIndex].sessions.push(session);
      }
    }

    setTableData(tableData);
  }, [schedule]);

  if (tableData.length === 0) return <div></div>;

  return (
    <div>
      <table className="border-collapse border border-slate-500 table table-fixed w-full">
        <thead>
          <tr>
            <TableHeader>Days / Time Slot</TableHeader>
            {schedule.timeSlots.map((slot) => (
              <TableHeader>{getTime(slot)}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.days.map((day) => (
            <tr>
              <TableHeader>{getDayNames([day])[0]}</TableHeader>
              {tableData[DayIndex.get(day)!].map((slotData) => {
                if (slotData.sessions.length === 0)
                  return <TableCell></TableCell>;
                const activeSession = slotData.sessions[slotData.activeIndex];
                return (
                  <SessionCell
                    session={activeSession}
                    index={slotData.activeIndex}
                    setIndex={(index) => {
                      slotData.activeIndex = index;
                      setTableData([...tableData]);
                    }}
                    totalSessions={slotData.sessions.length}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="border border-slate-500 p-5 px-3 font-medium bg-secondary/80">
      {children}
    </th>
  );
}

function TableCell({ children }: { children?: React.ReactNode }) {
  return (
    <td className="border border-slate-500 p-2 px-3 font-normal bg-secondary/40">
      {children}
    </td>
  );
}

function SessionCell({
  session,
  index,
  setIndex,
  totalSessions,
}: {
  session: Session;
  index: number;
  setIndex: (index: number) => void;
  totalSessions: number;
}) {
  // group names separated by commas
  const groupNames = session.groups.map((group) => group.name).join(", ");
  const maxChars = 20;
  const groupString =
    groupNames.length > maxChars
      ? groupNames.substring(0, maxChars) + "..."
      : groupNames;

  return (
    <TableCell>
      <div className="space-y-3 relative px-4">
        <div className="text-lg font-medium">
          {session.topic?.name || "No Topic"}
        </div>
        <p className="text-sm text-gray-500 ">{groupString}</p>
        <p className="text-xs font-light text-right -mr-3 text-gray-500">
          {index + 1 + "/" + totalSessions}
        </p>
        <div className="flex justify-between absolute inset-0 -mx-3 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-70 ">
          <ChevronLeft
            className="cursor-pointer"
            onClick={() => {
              if (index === 0) setIndex(totalSessions - 1);
              else setIndex(index - 1);
            }}
          ></ChevronLeft>
          <ChevronRight
            className="cursor-pointer"
            onClick={() => {
              if (index === totalSessions - 1) setIndex(0);
              else setIndex(index + 1);
            }}
          ></ChevronRight>
        </div>
      </div>
    </TableCell>
  );
}

export default ScheduleTable;
