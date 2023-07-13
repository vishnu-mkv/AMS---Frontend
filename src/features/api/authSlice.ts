import {
  Permission,
  RoleCreate,
  RoleDetail,
  User,
  roleSummary,
} from "@/interfaces/user";
import { apiSlice } from "../apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string; user: User },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),

    listRoles: builder.query<roleSummary[], void>({
      query: () => "/auth/roles",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Roles" as const, id })),
              { type: "Roles", id: "LIST" },
            ]
          : [{ type: "Roles", id: "LIST" }],
    }),
    getRole: builder.query<RoleDetail, string>({
      query: (id) => `/auth/roles/${id}`,
      providesTags: (result, error, id) =>
        result ? [{ type: "Roles", id }] : [],
    }),

    createRole: builder.mutation<RoleDetail, RoleCreate>({
      query: (body) => ({
        url: "/auth/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error) =>
        result ? [{ type: "Roles", id: "LIST" }] : [],
    }),

    updateRole: builder.mutation<
      RoleDetail,
      Partial<RoleCreate> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/auth/roles/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) =>
        result ? [{ type: "Roles", id }] : [],
    }),
    getPermissions: builder.query<Permission[], void>({
      query: () => "/auth/permissions",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Permissions" as const, id })),
              { type: "Permissions", id: "LIST" },
            ]
          : [{ type: "Permissions", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useListRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useGetPermissionsQuery,
} = authApiSlice;
