import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/ui/header";
import { getDayNames } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";

interface DaysSelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

function DaysSelector({ selectedDays, onChange }: DaysSelectorProps) {
  const [days, setDays] = React.useState<number[]>(selectedDays);

  return (
    <div className="space-y-7 min-w-[400px]">
      <Header title="Select Days" />
      <div className="grid gap-2 grid-cols-3">
        {/* create array 0 - 6 */}
        {Array.from(Array(7).keys()).map((day) => (
          <div
            key={day}
            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-100`}
            onClick={() => {
              if (days.includes(day as any)) {
                setDays(days.filter((d) => d !== day));
              } else {
                setDays([...days, day]);
              }
            }}
          >
            <Checkbox checked={days?.includes(day as any)}></Checkbox>
            <span>{getDayNames([day])[0]}</span>
          </div>
        ))}
      </div>
      <DialogClose>
        <Button
          variant={"default"}
          onClick={() => {
            onChange(days);
          }}
          className="mr-4"
        >
          Save
        </Button>
        <Button variant={"outline"}>Cancel</Button>
      </DialogClose>
    </div>
  );
}

export default DaysSelector;
