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
import { useGetScheduleQuery } from "@/features/api/scheduleSlics";
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
import SessionList from "../Attendance/SessionList";
import { Group, GroupSummary } from "@/interfaces/user";

import {
  SessionQueryState,
  useSessionQuery,
} from "../Attendance/SessionQueryContext";
import { DateRangePicker } from "@/components/DateRangePicker";
import GroupList from "../Groups/GroupList";

function RecordQuery() {
  const { state, setState } = useSessionQuery();
  const { schedule, timeSlots, topics, sessions, groups, date } = state;

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
                    const selectedTimeSlot =
                      value !== "-1"
                        ? scheduleData.timeSlots.find(
                            (timeSlot) => timeSlot.id === value
                          )
                        : undefined;
                    updateState({
                      timeSlots: selectedTimeSlot
                        ? [selectedTimeSlot]
                        : undefined,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Time Slot"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-1">All</SelectItem>
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
                <DateRangePicker
                  date={date ? { from: date[0], to: date[1] } : undefined}
                  onSelect={(date) =>
                    updateState({
                      date: date ? [date.from, date.to] : undefined,
                    })
                  }
                  disabled={(date) => {
                    return date > new Date();
                  }}
                ></DateRangePicker>
              </div>
              <MultiSelector<TopicSummary>
                dialogContent={
                  <TopicList
                    onSelect={(topics) =>
                      updateState({
                        topics,
                      })
                    }
                    selectedItems={topics || []}
                    allowSelect={true}
                    mode="multiple"
                  />
                }
                label="Topic"
                renderItem={(topic) => (
                  <span className="text-gray-700">{topic.name}</span>
                )}
                selectedItems={topics ?? []}
                setSelectedItems={(topics) => {
                  updateState({
                    topics,
                  });
                }}
                mode={"multiple"}
              ></MultiSelector>
              <MultiSelector<Session>
                dialogContent={
                  <SessionList
                    onSelect={(sessions) =>
                      updateState({
                        sessions: sessions,
                      })
                    }
                    selectedItems={sessions || []}
                    allowSelect={true}
                    mode="multiple"
                    items={scheduleData.sessions}
                  />
                }
                label="Session"
                renderItem={(session) => {
                  const content = `${session.topic?.name ?? "No topic"} at ${
                    session.slots.length
                  } slots`;
                  return (
                    <span className="text-gray-700 whitespace-nowrap overflow-hidden">
                      {content}
                    </span>
                  );
                }}
                selectedItems={sessions ?? []}
                mode="multiple"
                setSelectedItems={(sessions) =>
                  updateState({
                    sessions,
                  })
                }
              ></MultiSelector>
              <MultiSelector<GroupSummary>
                dialogContent={
                  <GroupList
                    onSelect={(groups) =>
                      updateState({
                        groups: groups.map((group) => ({
                          ...group,
                          groups: [],
                          users: [],
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
                  <span className="text-gray-700">{group.name}</span>
                )}
                selectedItems={groups ?? []}
                setSelectedItems={(groups) => {
                  updateState({
                    groups: groups.map((group) => ({
                      ...group,
                      groups: [],
                      users: [],
                    })),
                  });
                }}
                mode={"multiple"}
              ></MultiSelector>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecordQuery;
