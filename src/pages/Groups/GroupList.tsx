import ListSelector from "@/components/ListSelector";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import GroupItem from "@/pages/Groups/GroupItem";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import DebouncedInput from "@/components/ui/DebouncedInput";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Header from "@/components/ui/header";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { GroupSummary, GroupsQuery } from "@/interfaces/user";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { ListProps } from "@/interfaces/common";
import MultiSelector from "@/components/MultiSelector";
import { useListGroupsQuery } from "@/features/api/groupSlice";
import { ScheduleSummary } from "@/interfaces/schedule";
import ScheduleList from "../Schedules/ScheduleList";
import { DialogClose } from "@radix-ui/react-dialog";

type GroupListProps = ListProps<GroupSummary> & {
  schedules?: string[];
};

function GroupList(props: GroupListProps) {
  const { allowSelect } = props;
  const [query, setQuery] = useState<GroupsQuery>({
    page: 1,
    limit: 5,
    sort: "createdAt",
    order: "desc",
    search: "",
    scheduleId: props.schedules || [],
  });
  const [selectedSchedules, setSelectedSchedules] = useState<ScheduleSummary[]>(
    []
  );
  const [selectedGroups, setSelectedGroups] = useState<GroupSummary[]>(
    allowSelect ? props.selectedItems : ([] as GroupSummary[])
  );
  const { data: groups, isLoading, error } = useListGroupsQuery(query);

  useEffect(() => {
    setQuery({
      ...query,
      scheduleId:
        props.schedules || selectedSchedules.map((schedule) => schedule.id),
    });
  }, [selectedSchedules]);

  return (
    <div className="space-y-7 max-w-[600px] mx-auto">
      <Header
        title={allowSelect ? "Select Groups" : "Groups"}
        subtitle={
          allowSelect
            ? "Choose groups to for this action"
            : "All groups are listed here"
        }
      ></Header>

      <div className="flex justify-between gap-4">
        <DebouncedInput
          placeholder="Search groups by name "
          onValueChange={(value) => {
            setQuery({ ...query, search: value });
          }}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
              <Filter className="h-5 w-5 fill-black" />
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-[400px] space-y-6">
            <DialogTitle>
              <p>Filter groups and more</p>
            </DialogTitle>
            <div className="space-y-4">
              <Label>Sort By</Label>
              <Select
                onValueChange={(value) => {
                  setQuery({ ...query, sort: value as any });
                }}
                value={query.sort}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Sort By"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created At</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) =>
                  setQuery({ ...query, order: value as any })
                }
                value={query.order}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Sort Order"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label>Group Type</Label>
              <Select
                onValueChange={(value) => {
                  console.log(value);
                  setQuery({
                    ...query,
                    groupType:
                      value === "0" || value === "1"
                        ? parseInt(value)
                        : undefined,
                  });
                }}
                value={
                  query.groupType !== undefined
                    ? query.groupType.toString()
                    : "-1"
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Group Type"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">All</SelectItem>
                  <SelectItem value="0">Group of Users</SelectItem>
                  <SelectItem value="1">Group of Groups</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <MultiSelector<ScheduleSummary>
              selectedItems={selectedSchedules}
              label={"Schedules"}
              renderItem={(role) => (
                <p className="text-gray-600 text-sm">{role.name}</p>
              )}
              setSelectedItems={setSelectedSchedules}
              dialogContent={
                <ScheduleList
                  allowSelect={true}
                  onSelect={setSelectedSchedules}
                  selectedItems={selectedSchedules}
                />
              }
              selectedShowMode="block"
            ></MultiSelector>
            <DialogFooter>
              <DialogClose>
                <Button variant={"outline"}>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} title="Couldn't Fetch groups" />}
      {groups && (
        <ListSelector<GroupSummary>
          allowSelect={allowSelect || false}
          onSelect={(group) => {
            setSelectedGroups(group);
          }}
          items={groups.docs}
          renderItem={(group) => <GroupItem group={group} />}
          selectedItems={selectedGroups}
          isEqual={(x, y) => x.id === y.id}
          mode={props.allowSelect ? props.mode : "multiple"}
        ></ListSelector>
      )}
      {
        <Pagination
          page={groups?.page || 1}
          totalPages={groups?.totalPages || 1}
          setPage={(page) => {
            setQuery({ ...query, page });
          }}
        />
      }
      {allowSelect && (
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                if (allowSelect) {
                  props.onSelect(selectedGroups);
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

export default GroupList;
