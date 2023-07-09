import { PaginatedQuery } from "./common";

enum Gender {
  "MALE" = 0,
  "FEMALE" = 1,
}

enum GroupType {
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
  color: string | null;
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

export interface Group extends GroupSummary {
  groups: GroupSummary[];
  users: UserSummary[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: Gender;
  signInAllowed: boolean;
  picture: string | null;
  disabled: boolean;
  organization: Organization;
  roles: Role[];
  groups: GroupSummary[];
  scheduleId: string | null;
}

export type roleSummary = Pick<Role, "id" | "name" | "description" | "color">;

export type UserSummary = Pick<
  User,
  "id" | "firstName" | "lastName" | "picture" | "disabled"
> & {
  roles: roleSummary[];
};

export interface UsersQuery extends PaginatedQuery {
  roles?: string[];
}

export interface GroupsQuery extends PaginatedQuery {
  scheduleId?: string[];
  groupType?: GroupType;
}
