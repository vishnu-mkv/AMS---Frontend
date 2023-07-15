import ListSelector from "@/components/ListSelector";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import UserItem from "@/pages/Users/UserItem";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import DebouncedInput from "@/components/ui/DebouncedInput";
import {
  Dialog,
  DialogContent,
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
import { useListUsersQuery } from "@/features/api/usersSlics";
import { UserSummary, UsersQuery, roleSummary } from "@/interfaces/user";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { ListProps } from "@/interfaces/common";
import MultiSelector from "@/components/MultiSelector";
import RoleList from "../Roles/RoleList";
import { DialogClose } from "@radix-ui/react-dialog";

type UserListProps = ListProps<UserSummary> & {
  scheduleId?: string[];
};

function UserList(props: UserListProps) {
  const { allowSelect } = props;
  const [query, setQuery] = useState<UsersQuery>({
    page: 1,
    limit: 5,
    sort: "createdAt",
    order: "desc",
    search: "",
    roles: [],
    scheduleId: props.scheduleId,
  });
  const [selectedRoles, setSelectedRoles] = useState<roleSummary[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserSummary[]>(
    allowSelect ? props.selectedItems : ([] as UserSummary[])
  );
  const { data: users, isLoading, error } = useListUsersQuery(query);

  useEffect(() => {
    setQuery({
      ...query,
      roles: selectedRoles.map((role) => role.id),
    });
  }, [selectedRoles]);

  return (
    <div className="space-y-7 max-w-[600px] mx-auto">
      <div className="flex items-center justify-between">
        <Header
          title={allowSelect ? "Select Users" : "Users"}
          subtitle={
            allowSelect
              ? "Choose users to for this action"
              : "All users are listed here"
          }
        ></Header>
        {!allowSelect && <Button href="create">New</Button>}
      </div>

      <div className="flex justify-between gap-4">
        <DebouncedInput
          placeholder="Search users by name "
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
              <p>Filter users and more</p>
            </DialogTitle>
            <div className="space-y-4">
              <Label>Sort By</Label>
              <Select
                onValueChange={(value) => {
                  console.log(value);
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
            <MultiSelector<roleSummary>
              selectedItems={selectedRoles}
              label={"Roles"}
              renderItem={(role) => (
                <p className="text-gray-600 text-sm">{role.name}</p>
              )}
              setSelectedItems={setSelectedRoles}
              dialogContent={
                <RoleList
                  allowSelect={true}
                  onSelect={setSelectedRoles}
                  selectedItems={selectedRoles}
                />
              }
            ></MultiSelector>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} title="Couldn't Fetch users" />}
      {users && (
        <ListSelector<UserSummary>
          allowSelect={allowSelect || false}
          onSelect={(users) => {
            setSelectedUsers(users);
          }}
          items={users.docs}
          renderItem={(user) => <UserItem user={user} />}
          selectedItems={selectedUsers}
          isEqual={(x, y) => x.id === y.id}
          mode={props.allowSelect ? props.mode : "multiple"}
        ></ListSelector>
      )}
      {
        <Pagination
          page={users?.page || 1}
          totalPages={users?.totalPages || 1}
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
                  props.onSelect(selectedUsers);
                }
              }}
              disabled={selectedUsers.length === 0}
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

export default UserList;
