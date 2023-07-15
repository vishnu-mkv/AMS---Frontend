import { PaginatedQuery } from "./common";
import { ScheduleSummary } from "./schedule";

export enum Gender {
  "MALE" = 0,
  "FEMALE" = 1,
}

export enum GroupType {
  "GroupOfUsers" = 0,
  "GroupOfGroups" = 1,
}

export interface Organization {
  id: string;
  name: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  color: string | null;
}

export interface GroupSummary {
  id: string;
  name: string;
  color: string | null;
  groupType: GroupType;
  disabled: boolean;
  scheduleId: string;
}

export interface RoleDetail extends Role {
  users: UserSummary[];
}

export interface RoleCreate extends Omit<Role, "id" | "permissions"> {
  users?: string[];
  permissions?: string[];
}

export interface Group extends GroupSummary {
  groups: GroupSummary[];
  users: UserSummary[];
  schedule?: ScheduleSummary | null;
}

export type GroupCreate = Omit<
  GroupSummary,
  "id" | "disabled" | "groups" | "users" | "schedule" | "scheduleId"
> & {
  users?: string[];
  groups?: string[];
  scheduleId?: string;
};

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender;
  signInAllowed: boolean;
  picture: string | null;
  disabled: boolean;
  organization: Organization;
  roles: Role[];
  groups: GroupSummary[];
  scheduleId: string | null | undefined;
  userName?: string | null;
  schedule?: ScheduleSummary;
}

export type UserCreate = Omit<
  User,
  | "id"
  | "disabled"
  | "picture"
  | "roles"
  | "groups"
  | "organization"
  | "schedule"
> & {
  roleIds?: string[];
  pictureFile?: File;
  password?: string;
  groupIds?: string[];
};

export type roleSummary = Pick<Role, "id" | "name" | "description" | "color">;

export type UserSummary = Pick<
  User,
  "id" | "firstName" | "lastName" | "picture" | "disabled" | "scheduleId"
> & {
  roles: roleSummary[];
};

export interface UsersQuery extends PaginatedQuery {
  roles?: string[];
  scheduleId?: string[];
}

export interface GroupsQuery extends PaginatedQuery {
  scheduleId?: string[];
  groupType?: GroupType;
}
