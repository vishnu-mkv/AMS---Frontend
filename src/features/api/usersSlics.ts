import { PaginatedResponse, UserSummary, UsersQuery } from "@/interfaces/user";
import { apiSlice } from "../apiSlice";
import { buildQuery } from "@/lib/utils";

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
  }),
  overrideExisting: false,
});

export const { useListUsersQuery } = usersApiSlice;
