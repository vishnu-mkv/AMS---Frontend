import ListSelector from "@/components/ListSelector";
import Loading from "@/components/Loading";
import ScheduleItem from "@/pages/Schedules/ScheduleItem";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Header from "@/components/ui/header";
import { useState } from "react";
import { ScheduleSummary } from "@/interfaces/schedule";
import { ListProps } from "@/interfaces/common";
import { DialogClose } from "@radix-ui/react-dialog";
import { useListScheduleQuery } from "@/features/api/scheduleSlics";

function ScheduleList(props: ListProps<ScheduleSummary>) {
  const { allowSelect } = props;

  const [selectedItems, setSelectedItems] = useState<ScheduleSummary[]>(
    allowSelect ? props.selectedItems : ([] as ScheduleSummary[])
  );
  const { data: schedules, isLoading, error } = useListScheduleQuery();

  return (
    <div className="space-y-7 max-w-[600px] mx-auto">
      <Header
        title={allowSelect ? "Select Schedules" : "Schedules"}
        subtitle={
          allowSelect
            ? "Choose schedules to for this action"
            : "All schedules are listed here"
        }
      ></Header>
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} title="Couldn't Fetch schedules" />}
      {schedules && (
        <ListSelector<ScheduleSummary>
          allowSelect={allowSelect || false}
          onSelect={setSelectedItems}
          items={schedules}
          renderItem={(schedule) => <ScheduleItem schedule={schedule} />}
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
              disabled={selectedItems.length === 0}
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

export default ScheduleList;
