import ListSelector from "@/components/ListSelector";
import Loading from "@/components/Loading";
import TopicItem from "@/pages/Topics/TopicItem";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Header from "@/components/ui/header";
import { useState } from "react";
import { TopicSummary } from "@/interfaces/schedule";
import { ListProps } from "@/interfaces/common";
import { DialogClose } from "@radix-ui/react-dialog";
import { useListTopicsQuery } from "@/features/api/TopicSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";

type TopicListProps = ListProps<TopicSummary> & {
  items?: TopicSummary[];
};

function TopicList(props: TopicListProps) {
  const { allowSelect } = props;

  const [selectedItems, setSelectedItems] = useState<TopicSummary[]>(
    allowSelect ? props.selectedItems : ([] as TopicSummary[])
  );
  const {
    data: topics,
    isLoading,
    error,
  } = useListTopicsQuery(props.items ? skipToken : undefined);

  return (
    <div className="space-y-7 max-w-[600px] mx-auto">
      <Header
        title={allowSelect ? "Select Topics" : "Topics"}
        subtitle={
          allowSelect
            ? "Choose topics to for this action"
            : "All topics are listed here"
        }
      ></Header>
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} title="Couldn't Fetch topics" />}
      {(props.items || topics) && (
        <ListSelector<TopicSummary>
          allowSelect={allowSelect || false}
          onSelect={setSelectedItems}
          items={props.items ?? topics ?? []}
          renderItem={(topic) => <TopicItem topic={topic} />}
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

export default TopicList;
