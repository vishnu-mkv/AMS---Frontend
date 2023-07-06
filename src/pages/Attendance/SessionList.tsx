import ListSelector from "@/components/ListSelector";
import { Button } from "@/components/ui/Button";
import Header from "@/components/ui/header";
import { useState } from "react";
import { ListProps } from "@/interfaces/common";
import { DialogClose } from "@radix-ui/react-dialog";
import { SessionSummary } from "@/interfaces/schedule";
import SessionItem from "./SessionItem";

type SessionListProps = ListProps<SessionSummary> & {
  items: SessionSummary[];
};

function SessionList(props: SessionListProps) {
  const { allowSelect, items } = props;

  const [selectedItems, setSelectedItems] = useState<SessionSummary[]>(
    allowSelect ? props.selectedItems : ([] as SessionSummary[])
  );

  return (
    <div className="space-y-7 max-w-[600px] mx-auto">
      <Header
        title={allowSelect ? "Select Sessions" : "Sessions"}
        subtitle={
          allowSelect
            ? "Choose sessions to for this action"
            : "All sessions are listed here"
        }
      ></Header>
      {items && (
        <ListSelector<SessionSummary>
          allowSelect={allowSelect || false}
          onSelect={setSelectedItems}
          items={items}
          renderItem={(session) => <SessionItem session={session} />}
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

export default SessionList;
