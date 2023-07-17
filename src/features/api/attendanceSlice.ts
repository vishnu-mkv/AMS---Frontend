import { PaginatedResponse } from "@/interfaces/common";
import { apiSlice } from "../apiSlice";
import {
  AttendanceQuery,
  AttendanceStatus,
  Record,
  RecordSummary,
  updateAttendance,
  AddAttendance,
  RecordWithoutEntries,
} from "@/interfaces/attendance";
import { buildQuery } from "@/lib/utils";
import { AttendanceReportQuery, GroupReport } from "@/interfaces/report";

export const attendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listAttendance: builder.query<
      PaginatedResponse<RecordWithoutEntries>,
      AttendanceQuery
    >({
      query: (query) => ({
        url: "/attendance" + (query ? "?" + buildQuery(query) : ""),
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.docs.map(({ id }) => ({
                type: "Attendance" as const,
                id,
              })),
              { type: "Attendance", id: "LIST" },
            ]
          : [{ type: "Attendance", id: "LIST" }],
    }),
    getAttendanceStatus: builder.query<AttendanceStatus[], void>({
      query: () => ({
        url: "/attendance/attendance-status",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Attendance-status" as const,
                id,
              })),
              { type: "Attendance-status", id: "LIST" },
            ]
          : [{ type: "Attendance-status", id: "LIST" }],
    }),
    getAttendance: builder.query<Record, string>({
      query: (id) => ({
        url: `/attendance/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Attendance", id }],
    }),
    addAttendance: builder.mutation<RecordSummary, AddAttendance>({
      query: (body) => ({
        url: "/attendance",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Attendance", id: "LIST" }],
    }),
    updateAttendance: builder.mutation<RecordSummary, updateAttendance>({
      query: (body) => ({
        url: `/attendance/${body.AttendanceId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { AttendanceId: id }) => [
        { type: "Attendance", id },
        { type: "Attendance", id: "LIST" },
      ],
    }),
    getReport: builder.query<GroupReport, AttendanceReportQuery>({
      query: (query) => ({
        url:
          "/attendance/group-report" + (query ? "?" + buildQuery(query) : ""),
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [{ type: "Attendance", id: "LIST" }]
          : [{ type: "Attendance", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListAttendanceQuery,
  useGetAttendanceStatusQuery,
  useGetAttendanceQuery,
  useAddAttendanceMutation,
  useUpdateAttendanceMutation,
  useGetReportQuery,
} = attendanceApiSlice;
