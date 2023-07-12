import { ScrollArea } from "@/components/ui/scroll-area";
import { Schedule, Session, TimeSlot, getTime } from "@/interfaces/schedule";
import { cn, getDayNames } from "@/lib/utils";
import { CheckIcon, ChevronLeft, ChevronRight, PencilIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GroupItem, UserItem } from "../Attendance/GroupBrowser";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/Button";
import Header from "@/components/ui/header";
import { TrashIcon } from "lucide-react";
import { useDeleteSessionMutation } from "@/features/api/scheduleSlice";
import { ErrorMessage, Message } from "@/components/ui/Alert";

interface scheduleTableProps {
  schedule: Schedule;
  onSessionClick?: (session: Session) => void;
  showOnlySessionId?: string;
  onSlotClick?: (slot: TimeSlot, day: number) => void;
  onEditSession?: (session: Session) => void;
  allowDelete?: boolean;
}

interface SlotData {
  timeSlot: TimeSlot;
  sessions: Session[];
  activeIndex: number;
}

type TableData = SlotData[][];

function ScheduleTable({
  schedule,
  onSessionClick,
  showOnlySessionId,
  onSlotClick,
  onEditSession,
  allowDelete,
}: scheduleTableProps) {
  // day index - hash map of day to index

  const [viewSession, setViewSession] = useState<Session | undefined>(
    undefined
  );

  const [
    deleteSession,
    { isLoading: isDeleting, isSuccess: deleteSuccess, isError: deleteError },
  ] = useDeleteSessionMutation();

  function handleDeleteSession() {
    if (!viewSession || !allowDelete) return;
    deleteSession({
      id: viewSession.id,
      scheduleId: schedule.id,
    });
  }

  useEffect(() => {
    if (deleteSuccess) {
      setViewSession(undefined);
    }
  }, [deleteSuccess]);

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

  function slotClick(slot: TimeSlot, day: number) {
    if (onSlotClick) onSlotClick(slot, day);
  }

  return (
    <div className="grid">
      <ScrollArea orientation="horizontal" className="max-w-full">
        <table className="border-collapse border border-slate-500 table table-fixed min-w-full">
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
                    return (
                      <TableCell
                        onClick={() => slotClick(slotData.timeSlot, day)}
                      ></TableCell>
                    );

                  if (showOnlySessionId) {
                    // if the session id is not in the slot, return empty cell
                    if (
                      slotData.sessions.findIndex(
                        (session) => session.id === showOnlySessionId
                      ) === -1
                    ) {
                      return (
                        <TableCell
                          onClick={() => slotClick(slotData.timeSlot, day)}
                        ></TableCell>
                      );
                    }

                    return (
                      <TableCell
                        onClick={() => slotClick(slotData.timeSlot, day)}
                      >
                        <CheckIcon className="text-primary mx-auto"></CheckIcon>
                      </TableCell>
                    );
                  }

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
                      onClick={() => {
                        if (onSessionClick) onSessionClick(activeSession);
                        else setViewSession(activeSession);
                        slotClick(slotData.timeSlot, day);
                      }}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog
          open={!!viewSession}
          onOpenChange={(open) => {
            if (!open) {
              setViewSession(undefined);
            }
          }}
        >
          <DialogContent className="!max-w-[800px]">
            <DialogTitle asChild>
              <div className="flex gap-5 items-center justify-between">
                <Header title={viewSession?.topic?.name || "No topic"}></Header>

                <div className="">
                  {onEditSession && (
                    <Button
                      variant={"ghost"}
                      onClick={() => {
                        if (viewSession && onEditSession) {
                          onEditSession(viewSession);
                        }
                      }}
                    >
                      <PencilIcon
                        size="15"
                        className="text-primary"
                      ></PencilIcon>
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      {allowDelete && (
                        <Button variant={"ghost"}>
                          <TrashIcon
                            size="15"
                            className="text-red-400"
                          ></TrashIcon>
                        </Button>
                      )}
                    </DialogTrigger>
                    <DialogContent className="!max-w-[500px]">
                      <DialogTitle>Delete Session</DialogTitle>
                      <DialogDescription className="mt-5 my-8">
                        Are you sure you want to delete this session? This
                        action cannot be undone.
                      </DialogDescription>
                      <div className="space-y-5">
                        {deleteSuccess && (
                          <Message
                            title="Success"
                            message="Session deleted successfully"
                          />
                        )}
                        {deleteError && (
                          <ErrorMessage error={deleteError}></ErrorMessage>
                        )}
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        {!deleteSuccess && (
                          <Button
                            variant="destructive"
                            onClick={handleDeleteSession}
                            loader={{
                              loading: isDeleting,
                              text: "Deleting...",
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </DialogTitle>
            <div className="space-y-7 mt-7">
              <div className="space-y-3">
                <h2 className="text-medium">Groups</h2>
                {viewSession?.groups.map((g) => (
                  <GroupItem group={g} />
                ))}
              </div>
              <div className="space-y-3">
                <h2 className="text-medium">Attendance Takers</h2>
                {viewSession?.attendanceTakers.map((f) => (
                  <UserItem user={f} />
                ))}
              </div>
              <div className="space-y-3">
                <h2 className="text-medium">Slots</h2>
                <ScheduleTable
                  schedule={schedule}
                  showOnlySessionId={viewSession?.id}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose className="mt-5 flex justify-end">
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ScrollArea>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="border border-slate-500 p-5 px-3 font-medium bg-secondary/80 min-w-[8em]">
      {children}
    </th>
  );
}

function TableCell({
  children,
  onClick,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <td
      className={cn(
        "border border-slate-500 p-2 px-3 font-normal bg-secondary/40",
        {
          "cursor-pointer hover:bg-secondary/60": onClick !== undefined,
        }
      )}
      onClick={onClick}
    >
      {children}
    </td>
  );
}

function SessionCell({
  session,
  index,
  setIndex,
  totalSessions,
  onClick,
}: {
  session: Session;
  index: number;
  setIndex: (index: number) => void;
  totalSessions: number;
  onClick: () => void;
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
        <div className="text-lg font-medium  cursor-pointer" onClick={onClick}>
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
