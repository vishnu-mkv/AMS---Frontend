import MultiSelector from "@/components/MultiSelector";
import {
  ScheduleSummary,
  Session,
  TopicSummary,
  getTime,
} from "@/interfaces/schedule";
import { useMemo } from "react";
import ScheduleList from "../Schedules/ScheduleList";
import { Label } from "@/components/ui/label";
import { useGetScheduleQuery } from "@/features/api/scheduleSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { ErrorMessage, Message } from "@/components/ui/Alert";
import Loading from "@/components/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import TopicList from "../Topics/TopicList";
import SessionList from "./SessionList";
import { Group } from "@/interfaces/user";
import GroupBrowser from "./GroupBrowser";
import { authAtom } from "@/atoms/UserAtom";
import { useAtom } from "jotai";
import { SessionQueryState, useSessionQuery } from "./SessionQueryContext";

export type SessionQueryProps = {
  forAttendanceRecording?: boolean;
};

function SessionQuery({ forAttendanceRecording }: SessionQueryProps) {
  const [userAtom] = useAtom(authAtom);
  const { state, setState } = useSessionQuery();
  const {
    schedule,
    timeSlots,
    topics,
    sessions,
    groups,
    groupAccessPath,
    date,
  } = state;

  function updateState(newState: Partial<SessionQueryState>) {
    setState({
      ...state,
      ...newState,
    });
  }

  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    error: scheduleError,
  } = useGetScheduleQuery(schedule?.id ?? skipToken);

  const availableTopics = useMemo(() => {
    if (!scheduleData || !timeSlots || !date) return [] as TopicSummary[];
    return scheduleData.sessions
      .filter(
        (s) =>
          s.slots.some(
            (s) =>
              s.timeSlotId === timeSlots[0]?.id && s.day === date[0]?.getDay()
          ) && s.topic !== null
      )
      .map((s) => s.topic) as TopicSummary[];
  }, [schedule, timeSlots, date]);

  const availableSessions = useMemo(() => {
    if (!scheduleData || !timeSlots || !date) return [] as Session[];
    return scheduleData.sessions.filter(
      (s) =>
        s.slots.some(
          (s) =>
            s.timeSlotId === timeSlots[0]?.id && s.day === date[0]?.getDay()
        ) && (topics && s.topic ? s.topic?.id === topics[0].id : true)
    );
  }, [schedule, timeSlots, date, topics]);

  const canAttendanceForSession = useMemo(() => {
    if (!forAttendanceRecording || !sessions) return true;
    return sessions[0].attendanceTakers.some(
      (at) => at.id === userAtom.user?.id
    );
  }, [sessions]);

  return (
    <div className="space-y-7">
      <ErrorMessage
        error={scheduleError}
        title="Error loading schedule"
      ></ErrorMessage>
      <div className="@container">
        <div className="grid gap-7 @[700px]:grid-cols-2 @[1200px]:grid-cols-3">
          <MultiSelector<ScheduleSummary>
            dialogContent={
              <ScheduleList
                onSelect={(schedules) =>
                  updateState({
                    schedule: schedules[0],
                    date: [],
                    timeSlots: undefined,
                    topics: undefined,
                    sessions: undefined,
                  })
                }
                selectedItems={schedule ? [schedule] : []}
                allowSelect={true}
                mode="single"
              />
            }
            label="Schedule"
            renderItem={(schedule) => (
              <span className="text-gray-700">{schedule.name}</span>
            )}
            selectedItem={schedule}
            mode={"single"}
          ></MultiSelector>
          {scheduleData && (
            <>
              <div className="space-y-5">
                <Label>Time Slot</Label>
                <Select
                  value={timeSlots?.at(0)?.id}
                  onValueChange={(value) => {
                    const selectedTimeSlot = scheduleData.timeSlots.find(
                      (timeSlot) => timeSlot.id === value
                    );
                    updateState({
                      timeSlots: selectedTimeSlot
                        ? [selectedTimeSlot]
                        : undefined,
                      topics: undefined,
                      sessions: undefined,
                      groups: undefined,
                      groupAccessPath: [],
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Time Slot"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {scheduleData.timeSlots.map((timeSlot) => (
                      <SelectItem
                        key={timeSlot.id}
                        onClick={() => updateState({ timeSlots: [timeSlot] })}
                        value={timeSlot.id}
                      >
                        {getTime(timeSlot)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <DatePicker
                  selected={date && date[0]}
                  onSelect={(date) =>
                    updateState({
                      date: date ? [date] : [],
                      topics: undefined,
                      sessions: undefined,
                      groups: undefined,
                      groupAccessPath: [],
                    })
                  }
                  disabled={(date) => {
                    return (
                      date > new Date() ||
                      !scheduleData.days.includes(date.getDay() as Day)
                    );
                  }}
                ></DatePicker>
              </div>
              {date && date.length > 0 && timeSlots && (
                <>
                  <MultiSelector<TopicSummary>
                    dialogContent={
                      <TopicList
                        onSelect={(topics) =>
                          updateState({
                            topics,
                            sessions: undefined,
                            groups: undefined,
                            groupAccessPath: [],
                          })
                        }
                        selectedItems={topics || []}
                        allowSelect={true}
                        mode="single"
                        items={availableTopics}
                      />
                    }
                    label="Topic"
                    renderItem={(topic) => (
                      <span className="text-gray-700">{topic.name}</span>
                    )}
                    selectedItem={topics?.at(0)}
                    mode={"single"}
                  ></MultiSelector>
                  <MultiSelector<Session>
                    dialogContent={
                      <SessionList
                        onSelect={(sessions) =>
                          updateState({
                            sessions: sessions,
                            groups: undefined,
                            groupAccessPath: [],
                          })
                        }
                        selectedItems={sessions || []}
                        allowSelect={true}
                        mode="single"
                        items={availableSessions}
                        timeSlot={timeSlots.at(0)}
                        showCanTakeAttendance
                      />
                    }
                    label="Session"
                    renderItem={(session) => {
                      const content = `${
                        session.topic?.name ?? "No topic"
                      } at ${getTime(timeSlots[0])}`;
                      return (
                        <span className="text-gray-700 whitespace-nowrap overflow-hidden">
                          {content}
                        </span>
                      );
                    }}
                    selectedItem={sessions?.at(0)}
                    mode="single"
                  ></MultiSelector>
                </>
              )}
            </>
          )}
          {scheduleLoading && <Loading></Loading>}
          {sessions && !canAttendanceForSession && (
            <Message
              variant={"destructive"}
              message="You are not in the attendance takers list for this session"
              title="Unauthorized"
            />
          )}
          {sessions && sessions.length > 0 && canAttendanceForSession && (
            <MultiSelector<Group>
              dialogContent={
                <GroupBrowser
                  groupAccessPath={groupAccessPath || []}
                  session={sessions[0]}
                  setGroup={(group) => updateState({ groups: [group] })}
                  setGroupAccessPath={(groupAccessPath) =>
                    updateState({ groupAccessPath })
                  }
                />
              }
              label="Group"
              renderItem={(group) => (
                <span className="text-gray-700">{group.name}</span>
              )}
              selectedItem={groups?.at(0)}
              mode="single"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionQuery;
