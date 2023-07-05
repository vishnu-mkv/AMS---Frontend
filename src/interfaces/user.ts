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
}

export interface GroupSummary {
  id: string;
  name: string;
  color: string | null;
  groupType: GroupType;
  disabled: boolean;
  scheduleId: string;
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

export type roleSummary = Pick<Role, "id" | "name" | "description">;

export type UserSummary = Pick<
  User,
  "id" | "firstName" | "lastName" | "picture" | "disabled"
> & {
  roles: roleSummary[];
};

export interface PaginatedQuery {
  page: number;
  limit: number;
  order: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalPages: number;
  totalCount: number;
  page: number;
  limit: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface UsersQuery extends PaginatedQuery {
  search?: string;
  sort?: "createdAt" | "name";
}
