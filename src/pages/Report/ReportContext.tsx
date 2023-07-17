import { AttendanceStatus } from "@/interfaces/attendance";
import {
  AttendanceReportQuery,
  AttendanceReportQueryForm,
  GroupReport,
} from "@/interfaces/report";
import { TimeSlot } from "@/interfaces/schedule";
import { GroupSummary } from "@/interfaces/user";
import moment from "moment";
import { createContext, useContext, useMemo, useState } from "react";

interface GroupLoadingState {
  groupId: string;
  isLoading: boolean;
  error: any;
}

export interface GroupView {
  id: string;
  data?: GroupSummary;
  level: number;
  children: GroupView[];
}

type QueryWithoutGroup = Omit<AttendanceReportQueryForm, "group">;

interface AttendanceReportContextType {
  query: QueryWithoutGroup;
  updateQuery: (updatedQuery: QueryWithoutGroup) => void;
  groupLoadingStates: GroupLoadingState[];
  timeSlots: TimeSlot[];
  attendanceStatuses: AttendanceStatus[];
  setGroupLoadingState: (
    groupId: string,
    isLoading: boolean,
    error?: any
  ) => void;
  groupView?: GroupView;
  setRootGroup: (group: GroupView) => void;
  updateGroupView: () => void;
  getQuery: () => Omit<AttendanceReportQuery, "groupId">;
  dates: Date[];
  rootReport?: GroupReport;
  setRootReport: (report: GroupReport) => void;
}

const AttendanceReportContext = createContext<
  AttendanceReportContextType | undefined
>(undefined);

export const AttendanceReportProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [query, setQuery] = useState<QueryWithoutGroup>({});

  const [groupLoadingStates, setGroupLoadingStates] = useState<
    GroupLoadingState[]
  >([]);

  const [groupView, setGroupView] = useState<GroupView>();

  const [rootReport, setRootReport] = useState<GroupReport>();

  const timeSlots = useMemo(() => {
    if (!rootReport) return [];
    return rootReport.timeSlots;
  }, [rootReport]);

  const attendanceStatuses = useMemo(() => {
    if (!rootReport) return [];
    return rootReport.attendanceStatuses;
  }, [rootReport]);

  const dates: Date[] = useMemo(() => {
    // from start date to end date
    // choose days of week
    // if no days of week, choose all days
    if (
      !groupView ||
      !groupView.id ||
      !rootReport ||
      rootReport?.group.id !== groupView.id
    )
      return [];

    // find start date and end date from root report
    // if not found, return empty array
    // start date is minimum of the record entries
    const rootGroupReport = rootReport;

    const startDate = rootGroupReport?.dayReports.reduce((prev, curr) => {
      const currDate = moment(curr.date);
      if (!prev || currDate.isBefore(prev)) {
        return currDate;
      }
      return prev;
    }, null as moment.Moment | null);

    const endDate = rootGroupReport?.dayReports.reduce((prev, curr) => {
      const currDate = moment(curr.date);
      if (!prev || currDate.isAfter(prev)) {
        return currDate;
      }
      return prev;
    }, null as moment.Moment | null);

    const start = query.startDate ? moment(query.startDate) : startDate;
    const end = query.endDate ? moment(query.endDate) : endDate;

    if (!start || !end) return [];

    const daysOfWeek = query.days || [0, 1, 2, 3, 4, 5, 6];

    const dates: Date[] = [];

    for (let i = start; i.isSameOrBefore(end); i.add(1, "day")) {
      if (daysOfWeek.includes(i.day())) {
        dates.push(i.toDate());
      }
    }

    return dates;
  }, [query, groupView, rootReport]);

  function setRootGroup(group: GroupView) {
    setGroupView(group);
  }

  function updateGroup() {
    if (!groupView) return;
    setGroupView({ ...groupView });
  }

  const updateQuery = (updatedQuery: Partial<AttendanceReportQueryForm>) => {
    setQuery({ ...query, ...updatedQuery });
  };

  const getQuery = (): Omit<AttendanceReportQuery, "groupId"> => {
    return {
      attendanceStatusIds: query.attendanceStatuses?.map((status) => status.id),
      endDate: query.endDate && moment(query.endDate).format("YYYY-MM-DD"),
      startDate:
        query.startDate && moment(query.startDate).format("YYYY-MM-DD"),
      days: query.days,
      timeSlotIds: query.timeSlots?.map((slot) => slot.id),
      topicIds: query.topics?.map((topic) => topic.id),
    };
  };

  const setGroupLoadingState = (
    groupId: string,
    isLoading: boolean,
    error?: any
  ) => {
    const updatedStates = groupLoadingStates.map((state) => {
      if (state.groupId === groupId) {
        return { groupId, isLoading, error };
      }
      return state;
    });
    setGroupLoadingStates(updatedStates);
  };

  return (
    <AttendanceReportContext.Provider
      value={{
        query,
        updateQuery,
        groupLoadingStates,
        setGroupLoadingState,
        attendanceStatuses,
        timeSlots,
        groupView,
        setRootGroup,
        updateGroupView: updateGroup,
        getQuery,
        dates,
        rootReport,
        setRootReport,
      }}
    >
      {children}
    </AttendanceReportContext.Provider>
  );
};

export const useReportQuery = (): AttendanceReportContextType => {
  const context = useContext(AttendanceReportContext);

  if (!context) {
    throw new Error(
      "useAttendanceReportContext must be used within AttendanceReportProvider"
    );
  }

  return context;
};
