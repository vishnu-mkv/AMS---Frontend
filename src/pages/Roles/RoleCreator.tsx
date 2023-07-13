import ColorPicker from "@/components/ColorPicker";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import MultiSelector from "@/components/MultiSelector";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Fields";
import Header from "@/components/ui/header";
import {
  useCreateRoleMutation,
  useGetRoleQuery,
  useUpdateRoleMutation,
} from "@/features/api/authSlice";
import {
  Permission,
  RoleCreate,
  RoleDetail,
  UserSummary,
} from "@/interfaces/user";
import { Form, FormSubmit } from "@radix-ui/react-form";
import React, { FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserList from "../Users/UserList";
import { UserItem } from "../Attendance/GroupBrowser";
import PermissionList from "./PermissionList";

function RoleCreator() {
  // get id from url search params

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const mode = id ? "edit" : "create";

  const {
    data: role,
    isLoading: roleLoading,
    error: roleError,
  } = useGetRoleQuery(id ?? "", { skip: !id });

  const [createRole, { isLoading: loading, error, data }] =
    useCreateRoleMutation();

  const [
    updateRole,
    { isLoading: updateLoading, error: updateError, data: updateData },
  ] = useUpdateRoleMutation();

  const [newRole, setNewRole] = React.useState<Omit<RoleDetail, "id">>({
    name: "",
    color: "",
    description: "",
    permissions: [],
    users: [],
  });

  const navigate = useNavigate();

  function onChange(key: string, value: any) {
    setNewRole({ ...newRole, [key]: value });
  }

  useEffect(() => {
    if (data) {
      navigate(`/roles/${data.id}`);
    }
    if (updateData) {
      navigate(`/roles/${updateData.id}`);
    }
  }, [data, updateData]);

  useEffect(() => {
    if (role) {
      setNewRole(role);
    }
  }, [role]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const role: RoleCreate = {
      ...newRole,
      permissions: newRole.permissions.map((p) => p.id),
      users: newRole.users.map((u) => u.id),
    };
    if (mode === "create") {
      createRole(role);
    } else {
      if (!id) return;
      updateRole({ id, ...role });
    }
  }

  if (roleLoading) return <Loading />;

  return (
    <Container className="space-y-10">
      <Header
        title={mode === "create" ? "Create Role" : "Edit Role"}
        subtitle={mode === "create" ? "" : role?.name}
      ></Header>
      <Form onSubmit={onSubmit} className="space-y-7">
        <ColorPicker
          color={newRole.color}
          setColor={(color) => {
            onChange("color", color);
          }}
        ></ColorPicker>

        <ErrorMessage error={error || updateError || roleError}></ErrorMessage>
        <Input
          field={{
            type: "input",
            props: {
              required: true,
              name: "name",
              placeholder: "Enter role name",
              value: newRole?.name,
              onChange: (e) => {
                onChange("name", e.target.value);
              },
              type: "text",
            },
          }}
          label={{
            children: "Name",
          }}
        ></Input>
        <Input
          field={{
            type: "input",
            props: {
              required: true,
              name: "description",
              placeholder: "Enter role description",
              value: newRole?.description,
              onChange: (e) => {
                onChange("description", e.target.value);
              },
              type: "text",
            },
          }}
          label={{
            children: "Description",
          }}
        ></Input>
        <MultiSelector<Permission>
          dialogContent={
            <PermissionList
              onSelect={(permissions) => onChange("permissions", permissions)}
              selectedItems={newRole.permissions ?? []}
              allowSelect={true}
              mode="multiple"
            />
          }
          label="Permissions"
          renderItem={(p) => <div className="bg-transparent">{p.name}</div>}
          selectedItems={newRole.permissions ?? []}
          selectedShowMode="block"
          setSelectedItems={(permissions) => {
            onChange("permissions", permissions);
          }}
          mode={"multiple"}
        ></MultiSelector>
        <MultiSelector<UserSummary>
          dialogContent={
            <UserList
              onSelect={(users) => onChange("users", users)}
              selectedItems={newRole.users ?? []}
              allowSelect={true}
              mode="multiple"
            />
          }
          label="Users"
          renderItem={(u) => <UserItem user={u} className="bg-transparent" />}
          selectedItems={newRole.users ?? []}
          selectedShowMode="block"
          setSelectedItems={(users) => {
            onChange("users", users);
          }}
          mode={"multiple"}
        ></MultiSelector>
        {/* permissions */}

        <FormSubmit asChild>
          <Button
            width={"fullWidth"}
            loader={{
              loading: mode === "create" ? loading : updateLoading,
              text: mode === "create" ? "Creating" : "Saving",
            }}
          >
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </FormSubmit>
      </Form>
    </Container>
  );
}

export default RoleCreator;
