import ColorPicker from "@/components/ColorPicker";
import MultiSelector from "@/components/MultiSelector";
import { Input } from "@/components/ui/Fields";
import Header from "@/components/ui/header";
import {
  Schedule,
  ScheduleCreate,
  Session,
  TimeSlot,
  getTime,
} from "@/interfaces/schedule";
import { convertTimeSlot, getDayNames, toTitleCase } from "@/lib/utils";
import { Form, FormSubmit } from "@radix-ui/react-form";
import React, { useEffect, useState } from "react";
import DaysSelector from "./DaysSelector";
import Container from "@/components/Container";
import TimeSlotSelector from "./TimeSlotSelector";
import { Button } from "@/components/ui/Button";
import {
  ScheduleCreateorProvider,
  useScheduleCreateor,
} from "./ScheduleCreateorContext";
import {
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
} from "@/features/api/scheduleSlice";
import { ErrorMessage, Message } from "@/components/ui/Alert";
import Loading from "@/components/Loading";
import ScheduleTable from "./scheduleTable";
import SessionCreator, { defaultSession } from "./SessionCreator";

function ScheduleCreator() {
  return (
    <ScheduleCreateorProvider>
      <ScheduleCreatorController />
    </ScheduleCreateorProvider>
  );
}

function ScheduleCreatorController() {
  const { state } = useScheduleCreateor();
  const { page, loading, error } = state;

  if (loading) return <Loading />;

  if (error)
    return (
      <ErrorMessage
        error={error}
        title="Couldn't get the schedule"
      ></ErrorMessage>
    );

  return (
    <>
      {page === 1 && <ScheduleCreator1 />}
      {page === 2 && <ScheduleCreator2 />}
    </>
  );
}

function ScheduleCreator1() {
  const { state, setState, changeToEdit, changePage } = useScheduleCreateor();
  const { mode, schedule } = state;

  const [createSchedule, { isLoading: loading, error, data }] =
    useCreateScheduleMutation();

  const [
    UpdateSchedule,
    { isLoading: updateLoading, error: updateError, data: updateData },
  ] = useUpdateScheduleMutation();

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (data) {
      changeToEdit(data.id);
      // changePage(2);
      setMessage("Schedule created successfully");
    }
  }, [data]);

  useEffect(() => {
    if (updateData) {
      setMessage("Schedule updated successfully");
    }
  }, [updateData]);

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 7000);
  }, [message]);

  const setSchedule = (schedule: Schedule) => {
    setState({
      ...state,
      schedule,
    });
  };

  function onChange(key: keyof Schedule, value: any) {
    setSchedule({
      ...schedule,
      [key]: value,
    });
  }

  function handleUpdate() {
    const { name, color, days } = schedule;

    if (!name || color === undefined || !days) return;

    const data = {
      name,
      color,
      days,
    };

    UpdateSchedule({ id: schedule.id, ...data });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === "edit") {
      handleUpdate();
      return;
    }

    const { name, color, days, timeSlots } = schedule;

    if (!name || color === undefined || !days || !timeSlots) return;

    const data: ScheduleCreate = {
      name,
      color,
      days,
      timeSlots: timeSlots?.map((t) => convertTimeSlot(t)),
    };

    createSchedule(data);
  }

  return (
    <Container className="space-y-16">
      <Header
        title={
          mode === "edit" ? toTitleCase(schedule.name) : "Create New Schedule"
        }
        subtitle={mode === "create" ? "" : "You are currently editing."}
      ></Header>
      <ColorPicker
        className="mx-auto"
        color={schedule.color}
        setColor={(color) => onChange("color", color)}
      ></ColorPicker>

      <ErrorMessage error={error}></ErrorMessage>

      <Form className="col-span-3 space-y-5" onSubmit={handleSubmit}>
        <Message title="Changes saved" message={message}></Message>

        <ErrorMessage error={updateError || error}></ErrorMessage>

        <Input
          field={{
            props: {
              name: "name",
              value: schedule.name,
              onChange: (e) => onChange("name", e.target.value),
              placeholder: "Enter schedule name",
              required: true,
            },
            type: "input",
          }}
          label={{
            children: "Name",
          }}
        />
        <MultiSelector<string>
          selectedItems={getDayNames(schedule.days || [])}
          label="Days"
          renderItem={(day) => <span>{day}</span>}
          dialogContent={
            <DaysSelector
              onChange={(days) => onChange("days", days)}
              selectedDays={schedule.days || []}
            />
          }
        ></MultiSelector>
        <MultiSelector<TimeSlot>
          selectedItems={schedule.timeSlots || []}
          selectedShowMode="block"
          label="Time Slots"
          renderItem={(t) => <span>{getTime(t)}</span>}
          dialogContent={
            <TimeSlotSelector
              setTimeSlots={(t) => onChange("timeSlots", t)}
              timeSlots={schedule.timeSlots || []}
              formMode={mode}
              scheduleId={schedule.id}
            />
          }
        ></MultiSelector>
        <div className="flex justify-end gap-2">
          <FormSubmit asChild>
            <Button
              width={mode === "create" ? "fullWidth" : "minWidth"}
              loader={{
                loading: mode === "create" ? loading : updateLoading,
                text: mode === "create" ? "Creating" : "Saving",
              }}
            >
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </FormSubmit>
          {mode === "edit" && (
            <Button
              variant="secondary"
              onClick={() => changePage(2)}
              width="minWidth"
              type="button"
            >
              Next
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
}

function ScheduleCreator2() {
  const { state, changePage } = useScheduleCreateor();
  const { schedule } = state;

  const [newSession, setNewSession] = useState<Session>(defaultSession);
  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState<"create" | "edit">("create");

  function editSession(session: Session) {
    setMode("edit");
    setNewSession(session);
    setOpen(true);
  }

  function createSession() {
    setMode("create");
    setNewSession(defaultSession);
    setOpen(true);
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between flex-wrap gap-5">
        <Header
          title={
            mode === "edit" ? toTitleCase(schedule.name) : "Create New Schedule"
          }
          subtitle={mode === "create" ? "" : "You are currently editing."}
        ></Header>
        <Button onClick={createSession}>Add Session</Button>
      </div>
      <ScheduleTable
        schedule={schedule}
        onEditSession={editSession}
        allowDelete
      />
      <div className="flex gap-2 justify-between">
        <Button variant="outline" onClick={() => changePage(1)}>
          Back
        </Button>
        <SessionCreator
          session={newSession}
          setSession={setNewSession}
          schedule={schedule}
          mode={mode}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    </div>
  );
}

export default ScheduleCreator;
