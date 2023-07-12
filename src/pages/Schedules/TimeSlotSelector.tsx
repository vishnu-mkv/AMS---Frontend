import { MyTimePicker } from "@/components/TimePicker";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/ui/header";
import {
  useAddTimeSlotMutation,
  useDeleteTimeSlotMutation,
  useUpdateTimeSlotMutation,
} from "@/features/api/scheduleSlice";
import { TimeSlot, getTime } from "@/interfaces/schedule";
import { convertTimeSlot, sortTimeSlots } from "@/lib/utils";
import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import { PencilIcon, XIcon } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  setTimeSlots: (timeSlots: TimeSlot[]) => void;
  formMode?: "create" | "edit";
  scheduleId: string;
}

const defaultTimeSlot: TimeSlot = {
  id: uuidv4(),
  startTime: "00:00",
  endTime: "00:00",
};

function TimeSlotSelector({
  timeSlots: _timeSlots,
  setTimeSlots,
  formMode = "create",
  scheduleId,
}: TimeSlotSelectorProps) {
  const [newTimeSlot, setNewTimeSlot] =
    React.useState<Partial<TimeSlot>>(defaultTimeSlot);

  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [deleteTimeSlot, { isLoading, error }] = useDeleteTimeSlotMutation();

  const timeSlots = useMemo(() => sortTimeSlots(_timeSlots), [_timeSlots]);

  function onTimeSlotChange(newTimeSlot: Partial<TimeSlot>) {
    let slots = [...timeSlots];

    if (mode === "edit") {
      slots = slots.filter((t) => t.id !== newTimeSlot.id);
    }

    slots.push(newTimeSlot as TimeSlot);

    if (mode === "create") {
      setNewTimeSlot({ ...defaultTimeSlot, id: uuidv4() });
    }
  }

  function onTimeSlotDelete(id: string) {
    if (formMode !== "edit") {
      setTimeSlots(timeSlots.filter((t) => t.id !== id));
      return;
    }

    deleteTimeSlot({ id, scheduleId });
  }

  return (
    <div className="max-w-[500px] min-w-[400px]">
      <Header title="Select Time Slots" />
      {formMode === "edit" && (
        <p className="text-sm text-red-500 mb-5 -mt-5">
          Note : The actions performed are instant and cannot be undone.
        </p>
      )}
      <Button
        className="mb-5 "
        onClick={() => {
          setMode("create");
          setOpen(true);
          setNewTimeSlot({ ...defaultTimeSlot, id: uuidv4() });
        }}
      >
        Create New
      </Button>

      <ErrorMessage className="mb-5" error={error}></ErrorMessage>

      <TimeSlotCreator
        timeSlot={newTimeSlot}
        addTimeSlot={(timeSlot) => {
          onTimeSlotChange(timeSlot);
          setOpen(false);
        }}
        mode={mode}
        open={open}
        onOpenChange={setOpen}
        saveInstantly={formMode === "edit"}
        scheduleId={scheduleId}
      />

      <div className="space-y-5 mt-5 ">
        <div className="space-y-3">
          {timeSlots.map((timeSlot) => (
            <div
              className="p-2 px-4 rounded-sm bg-slate-100 flex justify-between items-center"
              key={timeSlot.id}
            >
              {getTime(timeSlot)}
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 ease-in-out">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMode("edit");
                    setOpen(true);
                    setNewTimeSlot({ ...timeSlot });
                  }}
                >
                  <PencilIcon size="14"></PencilIcon>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onTimeSlotDelete(timeSlot.id);
                  }}
                  loader={{
                    loading: isLoading && timeSlot.id === newTimeSlot.id,
                    text: "Deleting",
                  }}
                >
                  <XIcon size="14" className="text-red-400"></XIcon>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TimeSlotCreatorProps {
  timeSlot: Partial<TimeSlot>;
  addTimeSlot: (timeSlot: Partial<TimeSlot>) => void;
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saveInstantly?: boolean;
  scheduleId?: string;
}

function TimeSlotCreator({
  timeSlot: _timeSlot,
  addTimeSlot,
  mode,
  open,
  onOpenChange,
  saveInstantly = false,
  scheduleId,
}: TimeSlotCreatorProps) {
  const [timeSlot, setTimeSlot] = React.useState<Partial<TimeSlot>>({
    ..._timeSlot,
  });

  const [
    updateTimeSlot,
    {
      isLoading: updateTimeSlotLoading,
      error: updateTimeSlotError,
      isSuccess: updateTimeSlotSuccess,
    },
  ] = useUpdateTimeSlotMutation();

  const [
    createTimeSlot,
    {
      isLoading: createTimeSlotLoading,
      error: createTimeSlotError,
      isSuccess: createTimeSlotSuccess,
    },
  ] = useAddTimeSlotMutation();

  useEffect(() => {
    if (updateTimeSlotSuccess || createTimeSlotSuccess) {
      setTimeSlot(_timeSlot);
      onOpenChange(false);
    }
  }, [updateTimeSlotSuccess, createTimeSlotSuccess]);

  function handleTimeSlotChange() {
    if (!saveInstantly) {
      addTimeSlot(timeSlot);
      return;
    }

    if (!timeSlot.startTime || !timeSlot.endTime || !scheduleId || !timeSlot.id)
      return;

    const data = convertTimeSlot(timeSlot as TimeSlot);

    if (mode === "create") {
      createTimeSlot({ ...data, scheduleId });
    } else {
      updateTimeSlot({ ...data, scheduleId, id: timeSlot.id });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[400px]">
        <DialogTitle>
          {mode === "create" ? "Create Time Slot" : "Edit Time Slot"}
        </DialogTitle>
        <div className="space-y-7 my-10">
          <ErrorMessage
            error={updateTimeSlotError || createTimeSlotError}
          ></ErrorMessage>
          <div className="flex items-center gap-3 justify-between">
            <MyTimePicker
              label="Start Time"
              value={timeSlot.startTime || "00:00"}
              onChange={(startTime) =>
                setTimeSlot({
                  ...timeSlot,
                  startTime: startTime || undefined,
                })
              }
            ></MyTimePicker>

            <MyTimePicker
              label="End Time"
              value={timeSlot.endTime || "00:00"}
              onChange={(endTime) =>
                setTimeSlot({
                  ...timeSlot,
                  endTime: endTime || undefined,
                })
              }
            ></MyTimePicker>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleTimeSlotChange}
            loader={{
              loading: updateTimeSlotLoading || createTimeSlotLoading,
              text: "Saving",
            }}
          >
            {mode === "create" ? "Create Time Slot" : "Edit Time Slot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TimeSlotSelector;
