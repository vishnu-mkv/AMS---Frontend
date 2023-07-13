import ListSelector from "@/components/ListSelector";
import Loading from "@/components/Loading";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Header from "@/components/ui/header";
import { useState } from "react";
import { ListProps } from "@/interfaces/common";
import { DialogClose } from "@radix-ui/react-dialog";
import { Permission } from "@/interfaces/user";
import { useGetPermissionsQuery } from "@/features/api/authSlice";
import PermissionItem from "./PermissionItem";
import { skipToken } from "@reduxjs/toolkit/dist/query";

function PermissionList(
  props: ListProps<Permission> & {
    items?: Permission[];
    hideHeader?: boolean;
  }
) {
  const { allowSelect } = props;

  const [selectedItems, setSelectedItems] = useState<Permission[]>(
    allowSelect ? props.selectedItems : ([] as Permission[])
  );
  const {
    data: permissionsData,
    isLoading,
    error,
  } = useGetPermissionsQuery(props.items ? skipToken : undefined);

  let permissions = props.items ?? permissionsData ?? [];

  return (
    <div className="space-y-7 max-w-[600px] mx-auto">
      {!props.hideHeader && (
        <Header
          title={allowSelect ? "Select Permissions" : "Permissions"}
          subtitle={
            allowSelect
              ? "Choose permissions to for this action"
              : "All permissions are listed here"
          }
        ></Header>
      )}
      {isLoading && <Loading />}
      {error && (
        <ErrorMessage error={error} title="Couldn't Fetch permissions" />
      )}
      {permissions && (
        <ListSelector<Permission>
          allowSelect={allowSelect || false}
          onSelect={setSelectedItems}
          items={permissions}
          renderItem={(p) => <PermissionItem permission={p} />}
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

export default PermissionList;
