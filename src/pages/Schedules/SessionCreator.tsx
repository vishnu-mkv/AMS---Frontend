import MultiSelector from "@/components/MultiSelector";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Schedule,
  Session,
  SessionCreate,
  TopicSummary,
} from "@/interfaces/schedule";
import React, { useEffect, useState } from "react";
import TopicList from "../Topics/TopicList";
import { GroupSummary, UserSummary } from "@/interfaces/user";
import GroupList from "../Groups/GroupList";
import UserList from "../Users/UserList";
import { GroupItem, UserItem } from "../Attendance/GroupBrowser";
import ScheduleTable from "./scheduleTable";
import { v4 as uuidv4 } from "uuid";
import { Label } from "@/components/ui/label";
import {
  useCreateSessionMutation,
  useUpdateSessionMutation,
} from "@/features/api/scheduleSlice";
import { ErrorMessage, Message } from "@/components/ui/Alert";
import { DialogClose } from "@radix-ui/react-dialog";

interface SessionCreatorProps {
  session: Session;
  setSession: React.Dispatch<React.SetStateAction<Session>>;
  schedule: Schedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
}

export const defaultSession: Session = {
  id: uuidv4(),
  topic: null,
  groups: [],
  attendanceTakers: [],
  slots: [],
  topicId: null,
};

function SessionCreator({
  session,
  setSession,
  schedule: _schedule,
  mode = "create",
  open,
  onOpenChange,
}: SessionCreatorProps) {
  const { topic, groups, attendanceTakers } = session;

  const [addSession, { data, isLoading, error }] = useCreateSessionMutation();
  const [message, setMessage] = useState<string>("");

  const [
    updateSession,
    { data: updatedSession, isLoading: updateLoading, error: UpdateError },
  ] = useUpdateSessionMutation();

  function updateState(newState: Partial<Session>) {
    setSession({ ...session, ...newState });
  }

  const schedule: Schedule = { ..._schedule, sessions: [session] };

  useEffect(() => {
    if (data) {
      setSession(defaultSession);
      setMessage("Session created successfully");
    }
  }, [data, updatedSession]);

  useEffect(() => {
    if (updatedSession) {
      setMessage("Session updated successfully");
    }
  }, [updatedSession]);

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 7000);
  }, [message]);

  function handleSubmitSession() {
    const uniqueDays = new Set(session.slots.map((s) => s.day));

    const slots: SessionCreate["slots"] = Array.from(uniqueDays).map((day) => {
      const timeSlotIds = session.slots
        .filter((s) => s.day === day)
        .map((s) => s.timeSlotId);
      return {
        day,
        timeSlotIds,
      };
    });

    const data: SessionCreate = {
      topicId: session.topic?.id || null,
      attendanceTakerIds: session.attendanceTakers.map((u) => u.id),
      groupIds: session.groups.map((g) => g.id),
      slots,
      scheduleId: schedule.id,
    };

    if (mode === "create") {
      addSession(data);
    } else {
      updateSession({ id: session.id, ...data });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[700px]">
        <DialogTitle>
          {mode === "create" ? "Create Session" : "Edit Session"}
        </DialogTitle>
        <div className="space-y-7 mt-10">
          <ErrorMessage error={error || UpdateError}></ErrorMessage>
          {<Message message={message} title="Changes Saved"></Message>}
          {/* topic selector */}
          <MultiSelector<TopicSummary>
            dialogContent={
              <TopicList
                onSelect={(topics) =>
                  updateState({
                    topic: topics[0],
                  })
                }
                selectedItems={topic ? [topic] : []}
                allowSelect={true}
                mode="single"
              />
            }
            label="Topic"
            renderItem={(topic) => (
              <span className="text-gray-700">{topic.name}</span>
            )}
            selectedItem={topic || undefined}
            mode={"single"}
          ></MultiSelector>
          <MultiSelector<GroupSummary>
            dialogContent={
              <GroupList
                schedules={[schedule.id, "null"]}
                onSelect={(groups) =>
                  updateState({
                    groups: groups.map((group) => ({
                      ...group,
                    })),
                  })
                }
                selectedItems={groups || []}
                allowSelect={true}
                mode="multiple"
              />
            }
            label="Groups"
            renderItem={(group) => (
              <GroupItem className="bg-transparent" group={group} />
            )}
            selectedItems={groups ?? []}
            selectedShowMode="block"
            setSelectedItems={(groups) => {
              updateState({
                groups,
              });
            }}
            mode={"multiple"}
          ></MultiSelector>
          <MultiSelector<UserSummary>
            dialogContent={
              <UserList
                onSelect={(users) =>
                  updateState({
                    attendanceTakers: users,
                  })
                }
                selectedItems={attendanceTakers || []}
                allowSelect={true}
                mode="multiple"
              />
            }
            label="Attendance Takers"
            renderItem={(u) => <UserItem user={u} className="bg-transparent" />}
            selectedItems={attendanceTakers ?? []}
            selectedShowMode="block"
            setSelectedItems={(users) => {
              updateState({
                attendanceTakers: users,
              });
            }}
            mode={"multiple"}
          ></MultiSelector>

          <div className="space-y-5">
            <Label>Slots</Label>
            <ScheduleTable
              schedule={schedule}
              showOnlySessionId={session.id}
              onSlotClick={(timeSlot, day) => {
                // if slot is already in session, remove it
                const existingSlot = session.slots.find(
                  (s) => s.day === day && s.timeSlot?.id === timeSlot.id
                );
                if (existingSlot) {
                  updateState({
                    slots: session.slots.filter(
                      (s) => s.day !== day || s.timeSlot?.id !== timeSlot.id
                    ),
                  });
                }

                // else add it
                else {
                  updateState({
                    slots: [
                      ...session.slots,
                      {
                        id: uuidv4(),
                        day: day as any,
                        timeSlot,
                        timeSlotId: timeSlot.id,
                      },
                    ],
                  });
                }
              }}
            ></ScheduleTable>
          </div>
        </div>
        <DialogFooter className="mt-7">
          <DialogClose asChild>
            <Button
              onClick={() => {
                setSession(defaultSession);
              }}
              variant="outline"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmitSession}
            loader={{
              loading: isLoading || updateLoading,
              text: (mode === "create" ? "Creating" : "Updating") + " Session",
            }}
          >
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SessionCreator;
