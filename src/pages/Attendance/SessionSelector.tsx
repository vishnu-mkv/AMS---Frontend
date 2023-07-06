import MultiSelector from "@/components/MultiSelector";
import Header from "@/components/ui/header";
import {
  ScheduleSummary,
  SessionSummary,
  TimeSlot,
  TopicSummary,
  getTime,
} from "@/interfaces/schedule";
import { useEffect, useMemo, useState } from "react";
import ScheduleList from "../Schedules/ScheduleList";
import { Label } from "@/components/ui/label";
import {
  useGetScheduleQuery,
  useGetSessionQuery,
} from "@/features/api/scheduleSlics";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { ErrorMessage } from "@/components/ui/Alert";
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

function SessionSelector() {
  const [schedule, setSchedule] = useState<ScheduleSummary>();
  const [timeSlot, setTimeSlot] = useState<TimeSlot>();
  const [date, setDate] = useState<Date>();
  const [topic, setTopic] = useState<TopicSummary>();
  const [session, setSession] = useState<SessionSummary>();
  const [group, setGroup] = useState<Group>();
  const [groupAccessPath, setGroupAccessPath] = useState<Group[]>([]);

  const {
    data: sessionData,
    isLoading: sessionLoading,
    error: sessionError,
  } = useGetSessionQuery(session?.id ?? skipToken);

  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    error: scheduleError,
  } = useGetScheduleQuery(schedule?.id ?? skipToken);

  const availableTopics = useMemo(() => {
    if (!scheduleData || !timeSlot || !date) return [] as TopicSummary[];
    setTopic(undefined);
    return scheduleData.sessions
      .filter(
        (s) =>
          s.slots.some(
            (s) => s.timeSlotId === timeSlot?.id && s.day === date?.getDay()
          ) && s.topic !== null
      )
      .map((s) => s.topic) as TopicSummary[];
  }, [schedule, timeSlot, date]);

  const availableSessions = useMemo(() => {
    if (!scheduleData || !timeSlot || !date) return [] as SessionSummary[];
    setSession(undefined);
    return scheduleData.sessions.filter(
      (s) =>
        s.slots.some(
          (s) => s.timeSlotId === timeSlot?.id && s.day === date?.getDay()
        ) && (topic && s.topic ? s.topic?.id === topic.id : true)
    );
  }, [schedule, timeSlot, date, topic]);

  useEffect(() => {
    setGroup(undefined);
    setGroupAccessPath([]);
  }, [session]);

  useEffect(() => {
    setTimeSlot(undefined);
    setDate(undefined);
  }, [schedule]);

  return (
    <div className="space-y-7 max-w-[600px] mx-auto">
      <Header
        title="Record Attendance"
        subtitle="Select a session to continue"
      ></Header>
      <ErrorMessage
        error={scheduleError}
        title="Error loading schedule"
      ></ErrorMessage>
      <ErrorMessage
        error={sessionError}
        title="Error loading session"
      ></ErrorMessage>
      <MultiSelector<ScheduleSummary>
        dialogContent={
          <ScheduleList
            onSelect={(schedules) => setSchedule(schedules[0])}
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
        mode="single"
      ></MultiSelector>

      {scheduleData && (
        <>
          <div className="space-y-5">
            <Label>Time Slot</Label>
            <Select
              value={timeSlot?.id}
              onValueChange={(value) => {
                const selectedTimeSlot = scheduleData.timeSlots.find(
                  (timeSlot) => timeSlot.id === value
                );
                setTimeSlot(selectedTimeSlot);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Time Slot"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {scheduleData.timeSlots.map((timeSlot) => (
                  <SelectItem
                    key={timeSlot.id}
                    onClick={() => setTimeSlot(timeSlot)}
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
              selected={date}
              onSelect={setDate}
              disabled={(date) => {
                return (
                  date > new Date() ||
                  !scheduleData.days.includes(date.getDay() as Day)
                );
              }}
            ></DatePicker>
          </div>
          {date && timeSlot && (
            <>
              <MultiSelector<TopicSummary>
                dialogContent={
                  <TopicList
                    onSelect={(topics) => setTopic(topics[0])}
                    selectedItems={topic ? [topic] : []}
                    allowSelect={true}
                    mode="single"
                    items={availableTopics}
                  />
                }
                label="Topic"
                renderItem={(topic) => (
                  <span className="text-gray-700">{topic.name}</span>
                )}
                selectedItem={topic}
                mode="single"
              ></MultiSelector>
              <MultiSelector<SessionSummary>
                dialogContent={
                  <SessionList
                    onSelect={(sessions) =>
                      sessions[0]
                        ? setSession(sessions[0])
                        : setSession(undefined)
                    }
                    selectedItems={session ? [session] : []}
                    allowSelect={true}
                    mode="single"
                    items={availableSessions}
                  />
                }
                label="Session"
                renderItem={(session) => (
                  <span className="text-gray-700">
                    {session.topic?.name ?? "No topic"} at {getTime(timeSlot)}
                  </span>
                )}
                selectedItem={session}
                mode="single"
              ></MultiSelector>
            </>
          )}
        </>
      )}
      {scheduleLoading || (sessionLoading && <Loading></Loading>)}
      {sessionData && session && (
        <MultiSelector<Group>
          dialogContent={
            <GroupBrowser
              groupAccessPath={groupAccessPath}
              session={sessionData}
              setGroup={setGroup}
              setGroupAccessPath={setGroupAccessPath}
            />
          }
          label="Group"
          renderItem={(group) => (
            <span className="text-gray-700">{group.name}</span>
          )}
          selectedItem={group}
          mode="single"
        />
      )}
    </div>
  );
}

export default SessionSelector;
