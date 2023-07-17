import { apiSlice } from "../apiSlice";
import { CreateTopic, TopicSummary } from "@/interfaces/schedule";

export const topicsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listTopics: builder.query<TopicSummary[], void>({
      query: () => ({
        url: "/topics",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Topics" as const,
                id,
              })),
              { type: "Topics", id: "LIST" },
            ]
          : [{ type: "Topics", id: "LIST" }],
    }),
    getTopic: builder.query<TopicSummary, string>({
      query: (id) => ({
        url: `/topics/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Topics", id }],
    }),
    createTopic: builder.mutation<TopicSummary, CreateTopic>({
      query: (body) => ({
        url: "/topics",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Topics", id: "LIST" }],
    }),
    updateTopic: builder.mutation<
      TopicSummary,
      Partial<CreateTopic> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/topics/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, _, { id }) =>
        result ? [{ type: "Topics", id }] : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListTopicsQuery,
  useGetTopicQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
} = topicsApiSlice;
