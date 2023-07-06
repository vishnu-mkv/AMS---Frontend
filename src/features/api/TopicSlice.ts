import { apiSlice } from "../apiSlice";
import { TopicSummary } from "@/interfaces/schedule";

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
  }),
  overrideExisting: false,
});

export const { useListTopicsQuery } = topicsApiSlice;
