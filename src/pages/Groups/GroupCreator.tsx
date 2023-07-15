import ColorPicker from "@/components/ColorPicker";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import MultiSelector from "@/components/MultiSelector";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Fields";
import Header from "@/components/ui/header";
import {
  useCreateGroupMutation,
  useGetGroupQuery,
  useUpdateGroupMutation,
} from "@/features/api/groupSlice";
import { ScheduleSummary } from "@/interfaces/schedule";
import {
  GroupCreate,
  GroupSummary,
  GroupType,
  UserSummary,
} from "@/interfaces/user";
import { Form, FormSubmit } from "@radix-ui/react-form";
import React, { FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ScheduleList from "../Schedules/ScheduleList";
import GroupList from "./GroupList";
import { GroupItem, UserItem } from "../Attendance/GroupBrowser";
import UserList from "../Users/UserList";

const groupTypes = {
  [GroupType.GroupOfGroups]: "Group of Groups",
  [GroupType.GroupOfUsers]: "Group of Users",
};

type GroupCreateForm = Omit<GroupCreate, "groups" | "users" | "schedule"> & {
  groups: GroupSummary[];
  users: UserSummary[];
  schedule: ScheduleSummary;
};

function GroupCreator() {
  // get id from url search params

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const mode = id ? "edit" : "create";

  const {
    data: group,
    isLoading: groupLoading,
    error: groupError,
  } = useGetGroupQuery(id ?? "", { skip: !id });

  const [createGroup, { isLoading: loading, error, data }] =
    useCreateGroupMutation();

  const [
    updateGroup,
    { isLoading: updateLoading, error: updateError, data: updateData },
  ] = useUpdateGroupMutation();

  const [newGroup, setNewGroup] = React.useState<Partial<GroupCreateForm>>({});

  const navigate = useNavigate();

  function onChange(key: string, value: any) {
    setNewGroup({ ...newGroup, [key]: value });
  }

  useEffect(() => {
    if (data) {
      navigate(`/groups/${data.id}`);
    }
    if (updateData) {
      navigate(`/groups/${updateData.id}`);
    }
  }, [data, updateData]);

  useEffect(() => {
    if (group) {
      setNewGroup({ ...group, schedule: group.schedule ?? undefined });
    }
  }, [group]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    const { name, color, groupType, groups, schedule, users } = newGroup;

    if (!name || groupType === undefined) return;

    const data: GroupCreate = {
      color: color ?? null,
      name,
      groupType,
      groups:
        groupType === GroupType.GroupOfGroups
          ? groups?.map((x) => x.id)
          : undefined,
      scheduleId: schedule?.id ?? undefined,
      users:
        groupType === GroupType.GroupOfUsers
          ? users?.map((x) => x.id)
          : undefined,
    };

    if (mode === "create") {
      createGroup(data);
    } else {
      if (!group?.id) return;
      updateGroup({ id: group.id, ...data });
    }
  }

  if (groupLoading) return <Loading />;

  return (
    <Container className="space-y-10">
      <Header
        title={mode === "create" ? "Create Group" : "Edit Group"}
        subtitle={mode === "create" ? "" : group?.name}
      ></Header>
      <Form onSubmit={onSubmit} className="space-y-7">
        <ColorPicker
          color={newGroup.color}
          setColor={(color) => {
            onChange("color", color);
          }}
        ></ColorPicker>

        <ErrorMessage error={error || updateError || groupError}></ErrorMessage>
        <Input
          field={{
            type: "input",
            props: {
              required: true,
              name: "name",
              placeholder: "Enter group name",
              value: newGroup?.name,
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
        <Input<string>
          field={{
            type: "select",
            props: {
              required: true,
              data: Object.keys(groupTypes),
              getValue: (g) => g,
              getText: (g) => (groupTypes as any)[g].toString(),
              name: "groupType",
              value: newGroup.groupType?.toString(),
              onValueChange: (value) => {
                onChange("groupType", parseInt(value));
              },
              disabled: mode === "edit",
              placeholder: "Select Group Type",
            },
          }}
          label={{
            children: "Group Type",
          }}
        />
        <MultiSelector<ScheduleSummary>
          dialogContent={
            <ScheduleList
              onSelect={(schedules) => {
                setNewGroup({
                  ...newGroup,
                  schedule: schedules[0],
                  groups: newGroup.groups?.filter(
                    (g) => g.scheduleId === schedules[0].id || !g.scheduleId
                  ),
                  users: newGroup.users?.filter(
                    (u) => u.scheduleId === schedules[0].id || !u.scheduleId
                  ),
                });
              }}
              selectedItems={newGroup.schedule ? [newGroup.schedule] : []}
              allowSelect={true}
              mode="single"
            />
          }
          label="Schedule"
          renderItem={(schedule) => (
            <span className="text-gray-700">{schedule.name}</span>
          )}
          selectedItem={newGroup.schedule}
          mode={"single"}
          disabled={mode === "edit" && !!group?.schedule}
        ></MultiSelector>
        {newGroup.groupType === GroupType.GroupOfGroups && (
          <MultiSelector<GroupSummary>
            dialogContent={
              <GroupList
                onSelect={(groups) => onChange("groups", groups)}
                selectedItems={newGroup.groups ?? []}
                allowSelect={true}
                schedules={
                  newGroup.schedule ? [newGroup.schedule.id, "null"] : ["null"]
                }
              />
            }
            label="Groups"
            renderItem={(group) => (
              <GroupItem group={group} className="bg-transparent" />
            )}
            selectedItems={newGroup.groups ?? []}
            selectedShowMode="block"
            setSelectedItems={(groups) => onChange("groups", groups)}
          ></MultiSelector>
        )}
        {newGroup.groupType === GroupType.GroupOfUsers && (
          <MultiSelector<UserSummary>
            dialogContent={
              <UserList
                onSelect={(users) => onChange("users", users)}
                selectedItems={newGroup.users ?? []}
                allowSelect={true}
                scheduleId={
                  newGroup.schedule ? [newGroup.schedule.id, "null"] : ["null"]
                }
              />
            }
            label="Users"
            renderItem={(user) => (
              <UserItem user={user} className="bg-transparent" />
            )}
            selectedItems={newGroup.users ?? []}
            selectedShowMode="block"
            setSelectedItems={(users) => onChange("users", users)}
          ></MultiSelector>
        )}
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

export default GroupCreator;
