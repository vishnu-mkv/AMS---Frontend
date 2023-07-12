import { apiSlice } from "../apiSlice";
import {
  CreateTimeSlot,
  Schedule,
  ScheduleCreate,
  ScheduleSummary,
  Session,
  SessionCreate,
  SessionSummary,
  TimeSlot,
} from "@/interfaces/schedule";

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
    createSchedule: builder.mutation<ScheduleSummary, ScheduleCreate>({
      query: (data) => ({
        url: `/schedules`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error) => [{ type: "Schedules", id: "LIST" }],
    }),
    createSession: builder.mutation<SessionSummary, SessionCreate>({
      query: (data) => ({
        url: `/schedules/sessions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Sessions", id: "LIST" },
        { type: "Schedules", id: data.scheduleId },
      ],
    }),
    updateSession: builder.mutation<
      SessionSummary,
      SessionCreate & { id: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/schedules/sessions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Sessions", id: "LIST" },
        { type: "Schedules", id: data.scheduleId },
      ],
    }),
    updateSchedule: builder.mutation<
      ScheduleSummary,
      Omit<ScheduleCreate, "timeSlots"> & { id: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/schedules/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, data) =>
        result
          ? [
              { type: "Schedules", id: data.id },
              { type: "Schedules", id: "LIST" },
            ]
          : [],
    }),
    deleteSession: builder.mutation<void, { id: string; scheduleId: string }>({
      query: ({ id }) => ({
        url: `/schedules/sessions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id, scheduleId }) =>
        result
          ? [
              { type: "Sessions", id: "LIST" },
              { type: "Sessions", id },
              { type: "Schedules", id: scheduleId },
            ]
          : [],
    }),
    addTimeSlot: builder.mutation<
      TimeSlot,
      CreateTimeSlot & { scheduleId: string }
    >({
      query: ({ scheduleId, ...data }) => ({
        url: `/schedules/${scheduleId}/timeslots`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, data) =>
        result ? [{ type: "Schedules", id: data.scheduleId }] : [],
    }),
    deleteTimeSlot: builder.mutation<void, { id: string; scheduleId: string }>({
      query: ({ id, scheduleId }) => ({
        url: `/schedules/${scheduleId}/timeslots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id, scheduleId }) =>
        result ? [{ type: "Schedules", id: scheduleId }] : [],
    }),
    updateTimeSlot: builder.mutation<
      TimeSlot,
      CreateTimeSlot & { id: string; scheduleId: string }
    >({
      query: ({ id, scheduleId, ...data }) => ({
        url: `/schedules/${scheduleId}/timeslots/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, data) =>
        result ? [{ type: "Schedules", id: data.scheduleId }] : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListScheduleQuery,
  useGetScheduleQuery,
  useGetSessionQuery,
  useCreateScheduleMutation,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useUpdateScheduleMutation,
  useDeleteSessionMutation,
  useAddTimeSlotMutation,
  useDeleteTimeSlotMutation,
  useUpdateTimeSlotMutation,
} = scheduleApiSlice;
