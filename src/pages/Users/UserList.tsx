import ListSelector from "@/components/ListSelector";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import UserItem from "@/components/UserItem";
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
import { UserSummary, UsersQuery } from "@/interfaces/user";
import { Filter } from "lucide-react";
import { useState } from "react";

interface UserListProps {
  allowSelect?: boolean;
  onSelect?: (user: UserSummary[]) => void;
  close?: () => void;
  selected?: UserSummary[];
}

function UserList({
  allowSelect = false,
  onSelect = () => {},
  selected,
  close,
}: UserListProps) {
  const [query, setQuery] = useState<UsersQuery>({
    page: 1,
    limit: 5,
    sort: "createdAt",
    order: "desc",
  });
  const [selectedUsers, setSelectedUsers] = useState<UserSummary[]>(
    selected || ([] as UserSummary[])
  );
  const { data: users, isLoading, error } = useListUsersQuery(query);

  return (
    <div className="space-y-7 max-w-[600px]">
      <Header
        title={allowSelect ? "Select Users" : "Users"}
        subtitle={
          allowSelect
            ? "Choose users to for this action"
            : "All users are listed here"
        }
      ></Header>

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
                onValueChange={(value) =>
                  setQuery({ ...query, sort: value as any })
                }
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
          </DialogContent>
        </Dialog>
      </div>
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} title="Couldn't Fetch users" />}
      {users && (
        <ListSelector<UserSummary>
          allowSelect={allowSelect}
          onSelect={(users) => {
            setSelectedUsers(users);
          }}
          items={users.docs}
          renderItem={(user) => <UserItem user={user} />}
          selectedItems={selectedUsers}
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
          <Button onClick={close} variant={"outline"}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSelect(selectedUsers);
              close && close();
            }}
            disabled={selectedUsers.length === 0}
            variant={"default"}
          >
            Select
          </Button>
        </div>
      )}
    </div>
  );
}

export default UserList;
