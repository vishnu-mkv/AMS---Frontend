import React from "react";
import TimePicker from "react-time-picker";
import { Label } from "./ui/label";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

interface TimePickerProps {
  onChange: React.ComponentProps<typeof TimePicker>["onChange"];
  value: React.ComponentProps<typeof TimePicker>["value"];
  label: string;
}

export function MyTimePicker({ onChange, value, label }: TimePickerProps) {
  return (
    <div className="space-y-5">
      <Label>{label}</Label>
      <TimePicker
        onChange={onChange}
        value={value}
        format="hh:mm a"
        disableClock={true}
      />
    </div>
  );
}
