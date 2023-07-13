import ListSelector from "@/components/ListSelector";
import Loading from "@/components/Loading";
import RoleItem from "@/pages/Roles/RoleItem";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Header from "@/components/ui/header";
import { useState } from "react";
import { roleSummary } from "@/interfaces/user";
import { useListRolesQuery } from "@/features/api/authSlice";
import { ListProps } from "@/interfaces/common";
import { DialogClose } from "@radix-ui/react-dialog";

function RoleList(props: ListProps<roleSummary>) {
  const { allowSelect } = props;

  const [selectedItems, setSelectedItems] = useState<roleSummary[]>(
    allowSelect ? props.selectedItems : ([] as roleSummary[])
  );
  const { data: roles, isLoading, error } = useListRolesQuery();

  return (
    <div className="space-y-7 max-w-[600px] mx-auto">
      <div className="flex items-center justify-between">
        <Header
          title={allowSelect ? "Select Roles" : "Roles"}
          subtitle={
            allowSelect
              ? "Choose roles to for this action"
              : "All roles are listed here"
          }
        ></Header>
        {!allowSelect && <Button href="create">New</Button>}
      </div>
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} title="Couldn't Fetch roles" />}
      {roles && (
        <ListSelector<roleSummary>
          allowSelect={allowSelect || false}
          onSelect={setSelectedItems}
          items={roles}
          renderItem={(role) => <RoleItem role={role} />}
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

export default RoleList;
