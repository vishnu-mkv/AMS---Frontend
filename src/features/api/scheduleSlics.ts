import { apiSlice } from "../apiSlice";
import { Schedule, ScheduleSummary, Session } from "@/interfaces/schedule";

export const scheduleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listSchedule: builder.query<ScheduleSummary[], void>({
      query: () => ({
        url: "/schedules",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Schedules" as const,
                id,
              })),
              { type: "Schedules", id: "LIST" },
            ]
          : [{ type: "Schedules", id: "LIST" }],
    }),
    getSchedule: builder.query<Schedule, string>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Schedules", id }],
    }),
    getSession: builder.query<Session, string>({
      query: (id) => ({
        url: `/schedules/sessions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Sessions", id }],
    }),
  }),
  overrideExisting: false,
});

export const { useListScheduleQuery, useGetScheduleQuery, useGetSessionQuery } =
  scheduleApiSlice;
