import {
  AttendanceReportProvider,
  GroupView,
  useReportQuery,
} from "./ReportContext";
import MultiSelector from "@/components/MultiSelector";
import { GroupSummary, GroupType } from "@/interfaces/user";
import GroupList from "../Groups/GroupList";
import Loading from "@/components/Loading";
import { ErrorMessage } from "@/components/ui/Alert";
import { useEffect, useState } from "react";
import { useGetReportQuery } from "@/features/api/attendanceSlice";
import Header from "@/components/ui/header";
// import { ScrollArea } from "@/components/ui/scroll-area";
import moment from "moment";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { AttendanceReportQueryForm } from "@/interfaces/report";
import { Button } from "@/components/ui/Button";
import { getDayNames, toTitleCase } from "@/lib/utils";
import DaysSelector from "../Schedules/DaysSelector";
import { TimeSlot, getTime } from "@/interfaces/schedule";
import TimeSlotList from "./TimeSlotSelector";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/DateRangePicker";
import ColorAvatar from "@/components/ColorAvatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UserAvatar } from "@/components/Profile";
import { Check } from "lucide-react";

function ViewReport() {
  return (
    <AttendanceReportProvider>
      <Header title="Attendance Report"></Header>
      <ReportQuery></ReportQuery>
      <GroupReport></GroupReport>
    </AttendanceReportProvider>
  );
}

function ReportQuery() {
  const {
    groupView,
    setRootGroup,
    query: _query,
    updateQuery,
    timeSlots,
  } = useReportQuery();

  // store a local copy of query so that we can update it without triggering a re-render
  const [query, setQuery] = useState<AttendanceReportQueryForm>({
    ..._query,
    group: groupView?.data,
  });

  const Group = query.group;

  function onSubmitClick() {
    if (!query.group) return;
    setRootGroup({
      id: query.group?.id,
      level: 0,
      children: [],
      data: query.group,
    });
    updateQuery(query);
  }

  const { startDate, endDate } = query;

  return (
    <div className="space-y-5 @container">
      <div className="space-y-7 md:space-y-0 md:grid md:gap-7 @[700px]:grid-cols-2 @[1200px]:grid-cols-3">
        <MultiSelector<GroupSummary>
          dialogContent={
            <GroupList
              onSelect={(groups) => {
                setQuery({ ...query, group: groups[0] });
              }}
              selectedItems={Group ? [Group] : []}
              allowSelect={true}
              mode="single"
            />
          }
          label="Group"
          renderItem={(group) => (
            <span className="text-gray-700">{group.name}</span>
          )}
          selectedItem={Group}
          mode={"single"}
        ></MultiSelector>
        <div className="space-y-5">
          <Label>Date</Label>
          <DateRangePicker
            date={{ from: startDate, to: endDate }}
            onSelect={(date) =>
              setQuery({ ...query, startDate: date?.from, endDate: date?.to })
            }
            disabled={(date) => {
              return date > new Date();
            }}
          ></DateRangePicker>
        </div>
        <MultiSelector<string>
          selectedItems={getDayNames(query.days || [])}
          label="Days"
          renderItem={(day) => <span>{day}</span>}
          dialogContent={
            <DaysSelector
              onChange={(days) => {
                setQuery({ ...query, days: days });
              }}
              selectedDays={query.days || []}
            />
          }
        ></MultiSelector>
        <div className="col-span-2">
          <MultiSelector<TimeSlot>
            selectedItems={query.timeSlots || []}
            label="Time Slots"
            renderItem={(t) => <span>{getTime(t)}</span>}
            dialogContent={
              <TimeSlotList
                items={timeSlots}
                onSelect={(slots) => {
                  setQuery({ ...query, timeSlots: slots });
                }}
                selectedItems={query.timeSlots || []}
                allowSelect
                mode="multiple"
              />
            }
          ></MultiSelector>
        </div>
      </div>

      <Button width={"minWidth"} onClick={onSubmitClick}>
        Go
      </Button>
    </div>
  );
}

function GroupReport() {
  const {
    timeSlots,
    groupLoadingStates,
    dates,
    groupView,
    attendanceStatuses,
    cellRefs,
    rowStyles,
    columnStyles,
  } = useReportQuery();
  const Group = groupView?.data;

  const groupState = groupLoadingStates.find((x) => x.groupId === Group?.id);

  if (!Group) {
    return <></>;
  }

  if (groupState?.isLoading) {
    return <Loading />;
  }

  if (groupState?.error) {
    return <ErrorMessage error={groupState.error} />;
  }

  return (
    <div className="grid my-5">
      {/* <ScrollArea orientation="horizontal" className="max-w-full"> */}
      <Table
        showBorder
        centerHeader
        showHeaderBg
        id="report-table"
        className="relative "
        wrapperClassName="max-h-[calc(100vh-70px)]"
      >
        <TableHeader>
          <TableRow>
            {/* group color */}
            <TableHead
              className="!z-2"
              ref={cellRefs[0]}
              style={{ ...columnStyles[0], top: 0, zIndex: 5 }}
            ></TableHead>

            <TableHead
              className="text-left"
              style={{ ...columnStyles[1], top: 0, zIndex: 5 }}
            >
              Dates
            </TableHead>
            {dates.map((date) => (
              <TableHead
                colSpan={timeSlots.length * attendanceStatuses.length}
                key={date.toString()}
                style={rowStyles[0]}
                onMouseEnter={(e) => {
                  // set a higher z-index so that the hover card is not hidden by the table
                  e.currentTarget.style.zIndex = "100";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.zIndex =
                    rowStyles[0].zIndex?.toString() || "";
                }}
              >
                <HoverCard>
                  <HoverCardTrigger>
                    {moment(date).format("DD MMMM, YYYY")}
                  </HoverCardTrigger>
                  <HoverCardContent>
                    {/* day name */}
                    <div className="text-gray-700">
                      {moment(date).format("dddd")}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableHead>
            ))}
          </TableRow>
          <TableRow>
            {/* group color */}
            <TableHead
              ref={cellRefs[1]}
              style={{ ...columnStyles[0], top: rowStyles[1].top, zIndex: 5 }}
            ></TableHead>
            <TableHead
              className="text-left"
              style={{ ...columnStyles[1], top: rowStyles[1].top, zIndex: 5 }}
            >
              Slots
            </TableHead>
            {/* for each, display all timeslots */}
            {dates.map((date) => {
              return timeSlots
                .map((slot, index) => (
                  <TableHead
                    key={date.toString() + slot.id.toString()}
                    colSpan={attendanceStatuses.length}
                    style={rowStyles[1]}
                    onMouseEnter={(e) => {
                      // set a higher z-index so that the hover card is not hidden by the table
                      e.currentTarget.style.zIndex = "100";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.zIndex =
                        rowStyles[1].zIndex?.toString() || "";
                    }}
                  >
                    <HoverCard>
                      <HoverCardTrigger>{index + 1}</HoverCardTrigger>
                      <HoverCardContent>
                        {/* day name */}
                        <div className="text-gray-700">{getTime(slot)}</div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableHead>
                ))
                .flat();
            })}
          </TableRow>
          <TableRow>
            {/* group color */}
            <TableHead
              style={{ ...columnStyles[0], top: rowStyles[2].top, zIndex: 5 }}
            ></TableHead>

            <TableHead
              className="text-left"
              style={{ ...columnStyles[1], top: rowStyles[2].top, zIndex: 5 }}
            >
              Status
            </TableHead>
            {/* for each, display all timeslots */}
            {dates.map((date) => {
              return timeSlots
                .map((slot) =>
                  attendanceStatuses.map((status) => (
                    <TableHead
                      key={
                        date.toString() +
                        slot.id.toString() +
                        status.id.toString()
                      }
                      style={rowStyles[2]}
                      onMouseEnter={(e) => {
                        // set a higher z-index so that the hover card is not hidden by the table
                        e.currentTarget.style.zIndex = "100";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.zIndex =
                          rowStyles[2].zIndex?.toString() || "";
                      }}
                    >
                      <HoverCard>
                        <HoverCardTrigger>{status.shortName}</HoverCardTrigger>
                        <HoverCardContent>
                          {/* day name */}
                          <div className="text-gray-700">{status.name}</div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableHead>
                  ))
                )
                .flat();
            })}
          </TableRow>
        </TableHeader>
        <TableBody
          className="snap-y snap-mandatory"
          // style={{
          //   scrollPaddingTop: rowStyles[2].top,
          // }}
        >
          {groupState?.isLoading ? (
            <Loading />
          ) : (
            <GroupRow id={Group.id} isRoot={true} current={groupView} />
          )}
        </TableBody>
      </Table>
      {/* </ScrollArea> */}
    </div>
  );
}

function getKey(date: Date, slotId: string, statusId: string, id?: string) {
  const _key = `${date.getTime()}-${slotId}-${statusId}`;
  return id ? `${_key}-${id}` : _key;
}

type LookUpCount = Record<string, number | null | undefined>;

function GroupRow({
  id: groupId,
  isRoot,
  current,
}: {
  id: string;
  isRoot?: boolean;
  current: GroupView;
}) {
  const {
    getQuery,
    setRootReport,
    setGroupLoadingState,
    dates,
    attendanceStatuses,
    timeSlots,
    updateGroupView,
    columnStyles,
  } = useReportQuery();

  const {
    data: groupReport,
    isLoading,
    error,
  } = useGetReportQuery({ ...getQuery(), groupId: groupId });

  // a hashmap to store key-(date,slot-id-attendanceStatus-id) and count
  const [attendance, setAttendance] = useState<LookUpCount>({});

  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    if (!groupReport) return;
    if (isRoot) {
      setRootReport(groupReport);
    }

    const attendance: LookUpCount = {};
    groupReport.dayReports.forEach((x) => {
      x.timeSlotReports.forEach((y) => {
        y.attendanceStatusCounts.forEach((z) => {
          const key = getKey(
            new Date(x.date),
            y.timeSlotId,
            z.attendanceStatusId
          );
          attendance[key] = z.count;
        });
      });
    });

    setAttendance(attendance);
  }, [groupReport]);

  useEffect(() => {
    if (groupId) {
      setGroupLoadingState(groupId, isLoading, error);
    }
  }, [groupId, isLoading, error]);

  function expandChildren() {
    if (groupReport?.group.groupType === GroupType.GroupOfUsers) {
      setShowUsers(true);
      return;
    }

    if (!groupReport || groupReport.group.groups.length === 0) return;
    current.children = groupReport.group.groups.map((x) => ({
      id: x.id,
      level: current.level + 1,
      children: [],
      data: x,
    }));
    updateGroupView();
  }

  return (
    <>
      <TableRow className="snap-start ">
        {/* group color */}
        <TableHead style={columnStyles[0]}>
          <Indent level={current?.level}>
            <ColorAvatar
              color={groupReport?.group.color}
              className="h-5 w-5"
            ></ColorAvatar>
          </Indent>
        </TableHead>
        <TableHead
          className="whitespace-nowrap cursor-pointer text-left"
          onClick={expandChildren}
          style={columnStyles[1]}
        >
          <Indent level={current?.level} showArrows={false}>
            <span className="font-medium text-gray-950">
              {groupReport?.group.name}
            </span>
          </Indent>
        </TableHead>

        {dates.map((date) => {
          return timeSlots.map((slot) => {
            const anyStatusAvailable = attendanceStatuses.some((status) => {
              const key = getKey(date, slot.id, status.id);
              return attendance[key] !== undefined;
            });

            return attendanceStatuses
              .map((status) => (
                <TableCell
                  key={
                    "val" +
                    date.toString() +
                    slot.id.toString() +
                    status.id.toString()
                  }
                  className="text-center"
                >
                  {/* {getKey(date, slot.id, status.id)} */}
                  {attendance[getKey(date, slot.id, status.id)] ??
                    (anyStatusAvailable ? 0 : "")}
                </TableCell>
              ))
              .flat();
          });
        })}
      </TableRow>
      {current.children.map((x) => (
        <GroupRow key={x.id} id={x.id} current={x} isRoot={false} />
      ))}
      {showUsers && groupReport?.group.groupType === GroupType.GroupOfUsers && (
        <UsersGroup groupId={groupId} parent={current} />
      )}
    </>
  );
}

function UsersGroup({
  groupId,
  parent,
}: {
  groupId: string;
  parent: GroupView;
}) {
  const { getQuery, dates, attendanceStatuses, timeSlots, columnStyles } =
    useReportQuery();

  const { data: groupReport } = useGetReportQuery({
    ...getQuery(),
    groupId: groupId,
    isUserReport: true,
  });

  // a hashmap to store key-(date,slot-id-attendanceStatus-id) and count
  const [attendance, setAttendance] = useState<LookUpCount>({});

  useEffect(() => {
    if (!groupReport) return;

    const attendance: LookUpCount = {};

    groupReport.userReports.forEach((w) => {
      w.dayReports.forEach((x) => {
        x.timeSlotReports.forEach((y) => {
          y.attendanceStatusCounts.forEach((z) => {
            const key = getKey(
              new Date(x.date),
              y.timeSlotId,
              z.attendanceStatusId,
              w.user.id
            );
            attendance[key] = z.count;
          });
        });
      });
    });
    setAttendance(attendance);
  }, [groupReport]);

  return (
    <>
      {groupReport?.userReports.map((userReport) => (
        <TableRow key={userReport.user.id} className="snap-start">
          <TableHead style={columnStyles[0]}>
            <Indent level={parent?.level + 1}>
              <UserAvatar user={userReport.user}></UserAvatar>
            </Indent>
          </TableHead>
          <TableHead
            className="whitespace-nowrap text-left"
            style={columnStyles[1]}
          >
            <Indent level={parent?.level + 1} showArrows={false}>
              {toTitleCase(
                userReport.user.firstName + " " + userReport.user.lastName
              )}
            </Indent>
          </TableHead>
          {dates.map((date) => {
            return timeSlots
              .map((slot) =>
                attendanceStatuses.map((status) => (
                  <TableCell
                    key={
                      "val" +
                      date.toString() +
                      slot.id.toString() +
                      status.id.toString()
                    }
                    className="text-center "
                  >
                    {/* {getKey(date, slot.id, status.id, userReport.user.id)} */}
                    {attendance[
                      getKey(date, slot.id, status.id, userReport.user.id)
                    ] && (
                      <Check className="mx-auto block text-green-400 w-4 h-4" />
                    )}
                  </TableCell>
                ))
              )
              .flat();
          })}
        </TableRow>
      ))}
    </>
  );
}

function Indent({
  level,
  children,
  showArrows = true,
}: {
  level: number;
  children?: React.ReactNode;
  showArrows?: boolean;
}) {
  // provide a margin-left to indent the group name
  return (
    <div
      className="inline-block relative"
      style={{ marginLeft: `${level * 1.5}rem` }}
    >
      {/* L shape to connect to parent */}
      {level > 0 && showArrows && (
        <div className="absolute top-0 left-0 h-[4em] w-2 border-l border-b border-gray-800/20 -translate-y-[3.2em] -translate-x-[0.3em]"></div>
      )}
      <div className="relative z-1">{children}</div>
    </div>
  );
}

export default ViewReport;
