import {
  Group,
  GroupCreate,
  GroupSummary,
  GroupsQuery,
} from "@/interfaces/user";
import { apiSlice } from "../apiSlice";
import { buildQuery } from "@/lib/utils";
import { PaginatedResponse } from "@/interfaces/common";

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
      providesTags: (_, __, id) => [{ type: "Groups", id }],
    }),
    createGroup: builder.mutation<Group, GroupCreate>({
      query: (body) => ({
        url: "/groups",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),
    updateGroup: builder.mutation<Group, Partial<GroupCreate> & { id: string }>(
      {
        query: ({ id, ...body }) => ({
          url: `/groups/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: (result, _, { id }) =>
          result ? [{ type: "Groups", id }] : [],
      }
    ),
  }),
  overrideExisting: false,
});

export const {
  useListGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
} = groupApiSlice;
