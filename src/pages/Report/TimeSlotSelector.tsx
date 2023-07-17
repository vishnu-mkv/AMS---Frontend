import ListSelector from "@/components/ListSelector";
import { Button } from "@/components/ui/Button";
import Header from "@/components/ui/header";
import { useState } from "react";
import { TimeSlot, getTime } from "@/interfaces/schedule";
import { ListProps } from "@/interfaces/common";
import { DialogClose } from "@radix-ui/react-dialog";

type TimeSlotListProps = ListProps<TimeSlot> & {
  items: TimeSlot[];
};

function TimeSlotList(props: TimeSlotListProps) {
  const { allowSelect } = props;

  const [selectedItems, setSelectedItems] = useState<TimeSlot[]>(
    allowSelect ? props.selectedItems : ([] as TimeSlot[])
  );

  return (
    <div className="space-y-7 max-w-[600px] mx-auto">
      <div className="flex items-center justify-between">
        <Header
          title={allowSelect ? "Select Time Slots" : "Time Slots"}
          subtitle={
            allowSelect
              ? "Choose Time Slots for this action"
              : "All Time Slots are listed here"
          }
        ></Header>
      </div>

      {props.items && (
        <ListSelector<TimeSlot>
          allowSelect={allowSelect || false}
          onSelect={setSelectedItems}
          items={props.items ?? []}
          renderItem={(timeSlot) => (
            <span className="ml-3 text-gray-700 py-1 block">
              {getTime(timeSlot)}
            </span>
          )}
          selectedItems={selectedItems}
          isEqual={(x, y) => x.id === y.id}
          mode={props.allowSelect ? props.mode : "multiple"}
        ></ListSelector>
      )}
      {allowSelect && (
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                if (allowSelect) {
                  props.onSelect(selectedItems);
                }
              }}
              variant={"default"}
            >
              Select
            </Button>
          </DialogClose>
        </div>
      )}
    </div>
  );
}

export default TimeSlotList;
