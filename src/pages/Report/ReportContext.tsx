import { AttendanceStatus } from "@/interfaces/attendance";
import {
  AttendanceReportQuery,
  AttendanceReportQueryForm,
  GroupReport,
} from "@/interfaces/report";
import { TimeSlot } from "@/interfaces/schedule";
import { GroupSummary } from "@/interfaces/user";
import moment from "moment";
import React, { useEffect } from "react";
import { createContext, useContext, useMemo, useState } from "react";

// a debounce function that will only execute the callback after the specified delay
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

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

type TableCellRef = [
  React.RefObject<HTMLTableCellElement>,
  React.RefObject<HTMLTableCellElement>
];

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
  cellRefs: TableCellRef;
  rowStyles: [React.CSSProperties, React.CSSProperties, React.CSSProperties];
  columnStyles: [React.CSSProperties, React.CSSProperties];
}

const AttendanceReportContext = createContext<
  AttendanceReportContextType | undefined
>(undefined);

export const AttendanceReportProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [rootReport, setRootReport] = useState<GroupReport>();

  // refs for first 2 cells of first column
  const cellRefs: TableCellRef = useMemo(() => {
    return [
      React.createRef<HTMLTableCellElement>(),
      React.createRef<HTMLTableCellElement>(),
    ];
  }, []);

  const [columnStyles, setColumnStyles] = useState<
    [React.CSSProperties, React.CSSProperties]
  >([{}, {}]);

  const columnStylesObserver = useMemo(() => {
    return new ResizeObserver(() => {
      debounce(() => {
        setColumnStyles([
          {
            left: 0,
            position: "sticky",
            zIndex: 2,
          },
          {
            left: cellRefs[0].current?.offsetWidth || 0,
            position: "sticky",
            zIndex: 2,
          },
        ]);
      }, 200)();
    });
  }, [cellRefs[0].current?.offsetLeft]);

  const [rowStyles, setRowStyles] = useState<
    [React.CSSProperties, React.CSSProperties, React.CSSProperties]
  >([{}, {}, {}]);

  const rowStylesObserver = useMemo(() => {
    return new ResizeObserver(() => {
      debounce(() => {
        setRowStyles([
          {
            top: 0,
            position: "sticky",
            zIndex: 1,
          },
          {
            top: cellRefs[0].current?.offsetHeight || 0,
            position: "sticky",
            zIndex: 1,
          },
          {
            top:
              (cellRefs[1].current?.offsetHeight || 0) +
              (cellRefs[0].current?.offsetHeight || 0),
            position: "sticky",
            zIndex: 1,
          },
        ]);
      }, 200)();
    });
  }, [cellRefs[0].current?.offsetTop, cellRefs[1].current?.offsetTop]);

  useEffect(() => {
    if (cellRefs[0].current && cellRefs[1].current) {
      columnStylesObserver.observe(cellRefs[0].current);
      rowStylesObserver.observe(cellRefs[0].current);
      rowStylesObserver.observe(cellRefs[1].current);
    }

    return () => {
      columnStylesObserver.disconnect();
      rowStylesObserver.disconnect();
    };
  }, [cellRefs[0].current, cellRefs[1].current]);

  const [query, setQuery] = useState<QueryWithoutGroup>({});

  const [groupLoadingStates, setGroupLoadingStates] = useState<
    GroupLoadingState[]
  >([]);

  const [groupView, setGroupView] = useState<GroupView>();

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
        cellRefs,
        rowStyles,
        columnStyles,
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
