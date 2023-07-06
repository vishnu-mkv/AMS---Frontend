import {
  Group,
  GroupSummary,
  GroupsQuery,
  PaginatedResponse,
} from "@/interfaces/user";
import { apiSlice } from "../apiSlice";
import { buildQuery } from "@/lib/utils";

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listGroups: builder.query<
      PaginatedResponse<GroupSummary>,
      GroupsQuery | void
    >({
      query: (query) => ({
        url: "/groups" + (query ? "?" + buildQuery(query) : ""),
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.docs.map(({ id }) => ({
                type: "Groups" as const,
                id,
              })),
              { type: "Groups", id: "LIST" },
            ]
          : [{ type: "Groups", id: "LIST" }],
    }),
    getGroup: builder.query<Group, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Groups", id }],
    }),
  }),
  overrideExisting: false,
});

export const { useListGroupsQuery, useGetGroupQuery } = groupApiSlice;
