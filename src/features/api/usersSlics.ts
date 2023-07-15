import { User, UserCreate, UserSummary, UsersQuery } from "@/interfaces/user";
import { apiSlice } from "../apiSlice";
import { buildQuery } from "@/lib/utils";
import { PaginatedResponse } from "@/interfaces/common";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query<PaginatedResponse<UserSummary>, UsersQuery | void>(
      {
        query: (query) => ({
          url: "/users" + (query ? "?" + buildQuery(query) : ""),
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.docs.map(({ id }) => ({
                  type: "Users" as const,
                  id,
                })),
                { type: "Users", id: "LIST" },
              ]
            : [{ type: "Users", id: "LIST" }],
      }
    ),
    getUser: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) =>
        result ? [{ type: "Users", id }] : [],
    }),
    createUser: builder.mutation<User, FormData>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, formdata) => {
        const groupIds = formdata.getAll("groupIds");
        const roleIds = formdata.getAll("roleIds");

        return result
          ? [
              { type: "Users", id: "LIST" },
              ...groupIds.map((id) => ({
                type: "Groups" as const,
                id: id as string,
              })),
              ...roleIds.map((id) => ({
                type: "Roles" as const,
                id: id as string,
              })),
            ]
          : [];
      },
    }),
    updateUser: builder.mutation<User, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { data }) => {
        const groupIds = data.getAll("groupIds");
        const roleIds = data.getAll("roleIds");

        return result
          ? [
              { type: "Users", id: "LIST" },
              { type: "Users", id: result.id },
              ...groupIds.map((id) => ({
                type: "Groups" as const,
                id: id as string,
              })),
              ...roleIds.map((id) => ({
                type: "Roles" as const,
                id: id as string,
              })),
            ]
          : [];
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useListUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = usersApiSlice;
