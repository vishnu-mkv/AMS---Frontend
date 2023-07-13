import ColorPicker from "@/components/ColorPicker";
import Container from "@/components/Container";
import { DatePicker } from "@/components/DatePicker";
import Loading from "@/components/Loading";
import MultiSelector from "@/components/MultiSelector";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Fields";
import Header from "@/components/ui/header";
import { Label } from "@/components/ui/label";
import {
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/features/api/usersSlics";
import { ScheduleSummary } from "@/interfaces/schedule";
import {
  Gender,
  GroupSummary,
  UserCreate,
  roleSummary,
} from "@/interfaces/user";
import { Form, FormSubmit } from "@radix-ui/react-form";
import moment from "moment";
import React, { FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ScheduleList from "../Schedules/ScheduleList";
import { GroupItem } from "../Attendance/GroupBrowser";
import GroupList from "../Groups/GroupList";
import ImageSelector, { ImageStore } from "@/components/ImageSelector";
import { addArrayToForm, getBlob } from "@/lib/utils";
import RoleList from "../Roles/RoleList";

type CreateUserForm = Omit<
  UserCreate,
  "roleIds" | "groupIds" | "dob" | "scheduleId" | "pictureFile"
> & {
  groups: GroupSummary[];
  roles: roleSummary[];
  dob?: Date;
  schedule?: ScheduleSummary;
  picture: ImageStore;
};

const genders = {
  Male: Gender.MALE,
  Female: Gender.FEMALE,
};

function UserCreator() {
  // get id from url search params

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const mode = id ? "edit" : "create";

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useGetUserQuery(id ?? "", { skip: !id });

  const [createUser, { isLoading: loading, error, data }] =
    useCreateUserMutation();

  const [
    updateUser,
    { isLoading: updateLoading, error: updateError, data: updateData },
  ] = useUpdateUserMutation();

  const [newUser, setNewUser] = React.useState<Partial<CreateUserForm>>({
    firstName: "",
    gender: undefined,
    lastName: "",
    groups: [],
    roles: [],
  });

  const navigate = useNavigate();

  function onChange(key: keyof CreateUserForm, value: any) {
    setNewUser({ ...newUser, [key]: value });
  }

  useEffect(() => {
    if (data) {
      navigate(`/users/${data.id}`);
    }
    if (updateData) {
      navigate(`/users/${updateData.id}`);
    }
  }, [data, updateData]);

  useEffect(() => {
    if (user) {
      setNewUser({
        ...user,
        dob: moment(user.dob).toDate(),
        picture: {},
        gender: (user.gender === Gender.MALE ? "0" : "1") as any,
      });
    }
  }, [user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const {
      firstName,
      lastName,
      gender,
      groups,
      roles,
      dob,
      schedule,
      picture,
      signInAllowed,
      password,
      userName,
    } = newUser;

    if (!firstName || !lastName || !gender || !dob || !groups || !roles) return;

    const user: UserCreate = {
      firstName,
      gender,
      lastName,
      signInAllowed,
      dob: moment(dob).format("YYYY-MM-DD"),
      scheduleId: schedule?.id,
      password,
      userName,
    } as UserCreate;

    let formData = new FormData();

    Object.keys(user).forEach((key) => {
      formData.append(key, (user as any)[key]);
    });

    addArrayToForm(
      formData,
      groups.map((g) => g.id),
      "groupIds"
    );
    addArrayToForm(
      formData,
      roles.map((r) => r.id),
      "roleIds"
    );

    if (picture?.url) {
      formData.append("pictureFile", await getBlob(picture.url), picture.name);
    }

    if (mode === "create") {
      createUser(formData);
    } else {
      if (!id) return;
      updateUser({ id: id, data: formData });
    }
  }

  if (userLoading) return <Loading />;

  return (
    <Container className="space-y-10">
      <Header
        title={mode === "create" ? "Create User" : "Edit User"}
        subtitle={
          mode === "create" ? "" : user?.firstName + " " + user?.lastName
        }
      ></Header>
      <Form onSubmit={onSubmit} className="space-y-7">
        <div className="w-36 mx-auto">
          <ImageSelector
            selectedFile={newUser?.picture}
            onFileChange={(file) => {
              onChange("picture", file);
            }}
            user={{
              firstName: newUser?.firstName,
              lastName: newUser?.lastName,
              picture: user?.picture ?? undefined,
            }}
          />
        </div>

        <ErrorMessage error={error || updateError || userError}></ErrorMessage>
        <Input
          field={{
            type: "input",
            props: {
              required: true,
              name: "firstName",
              placeholder: "Enter user first name",
              value: newUser?.firstName,
              onChange: (e) => {
                onChange("firstName", e.target.value);
              },
              type: "text",
            },
          }}
          label={{
            children: "First Name",
          }}
        ></Input>
        <Input
          field={{
            type: "input",
            props: {
              required: true,
              name: "lastName",
              placeholder: "Enter user last name",
              value: newUser?.lastName,
              onChange: (e) => {
                onChange("lastName", e.target.value);
              },
              type: "text",
            },
          }}
          label={{
            children: "Last Name",
          }}
        ></Input>
        <div className="flex gap-5 items-center">
          <div className="space-y-1 grow">
            <Label>Date of Birth</Label>
            <DatePicker
              disabled={(d) => d > new Date()}
              selected={newUser.dob}
              onSelect={(date) => {
                onChange("dob", date);
              }}
            />
          </div>
          <div className="grow">
            <Input<string>
              field={{
                type: "select",
                props: {
                  required: true,
                  data: Object.keys(genders),
                  getText: (g) => g,
                  getValue: (g) => (genders as any)[g].toString(),
                  name: "gender",
                  value: newUser?.gender?.toString(),
                  onValueChange: (value) => {
                    onChange("gender", value);
                  },

                  placeholder: "Select Gender",
                },
              }}
              label={{
                children: "Gender",
              }}
            />
          </div>
        </div>
        <MultiSelector<roleSummary>
          selectedItems={newUser.roles ?? []}
          label={"Roles"}
          renderItem={(role) => (
            <p className="text-gray-600 text-sm">{role.name}</p>
          )}
          setSelectedItems={(roles) => {
            onChange("roles", roles);
          }}
          selectedShowMode="block"
          dialogContent={
            <RoleList
              allowSelect={true}
              onSelect={(roles) => onChange("roles", roles)}
              selectedItems={newUser.roles ?? []}
            />
          }
        ></MultiSelector>
        <MultiSelector<ScheduleSummary>
          dialogContent={
            <ScheduleList
              onSelect={(schedules) => {
                setNewUser({
                  ...newUser,
                  schedule: schedules[0],
                  groups: newUser.groups?.filter(
                    (g) => g.scheduleId === schedules[0].id
                  ),
                });
              }}
              selectedItems={newUser.schedule ? [newUser.schedule] : []}
              allowSelect={true}
              mode="single"
            />
          }
          label="Schedule"
          renderItem={(schedule) => (
            <span className="text-gray-700">{schedule.name}</span>
          )}
          selectedItem={newUser.schedule}
          mode={"single"}
          disabled={mode === "edit" && !!newUser.schedule}
        ></MultiSelector>
        <MultiSelector<GroupSummary>
          dialogContent={
            <GroupList
              onSelect={(groups) => onChange("groups", groups)}
              selectedItems={newUser.groups ?? []}
              allowSelect={true}
              schedules={newUser.schedule ? [newUser.schedule.id] : []}
            />
          }
          label="Groups"
          renderItem={(group) => (
            <GroupItem group={group} className="bg-transparent" />
          )}
          selectedItems={newUser.groups ?? []}
          selectedShowMode="block"
          setSelectedItems={(groups) => onChange("groups", groups)}
        ></MultiSelector>
        {/* a line */}
        <div className="border border-gray-400"></div>
        <Input
          field={{
            type: "checkbox",
            props: {
              name: "signInAllowed",
              checked: newUser.signInAllowed,
              onCheckedChange: (e) => {
                onChange("signInAllowed", e);
              },
            },
          }}
          label={{
            children: "Sign In Allowed",
          }}
        />
        {/* if sign in allowed, username and password */}
        {newUser.signInAllowed && (
          <>
            <Input
              field={{
                type: "input",
                props: {
                  required: true,
                  name: "username",
                  placeholder: "Enter username",
                  value: newUser?.userName ?? undefined,
                  onChange: (e) => {
                    onChange("userName", e.target.value);
                  },
                  type: "text",
                },
              }}
              label={{
                children: "Username",
              }}
            />
            <Input
              field={{
                type: "input",
                props: {
                  required:
                    (mode === "create" && newUser.signInAllowed) ||
                    (mode === "edit" &&
                      newUser.signInAllowed &&
                      !user?.signInAllowed),
                  name: "password",
                  placeholder: "Enter password",
                  value: newUser?.password ?? undefined,
                  onChange: (e) => {
                    onChange("password", e.target.value);
                  },
                  type: "password",
                },
              }}
              label={{
                children: mode === "create" ? "Password" : "New Password",
              }}
            />
          </>
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

export default UserCreator;
