import {
  ScheduleSummary,
  Session,
  TimeSlot,
  TopicSummary,
} from "@/interfaces/schedule";
import { Group } from "@/interfaces/user";
import { createContext, useContext, useState } from "react";

export type SessionQueryState = {
  schedule?: ScheduleSummary;
  timeSlots?: TimeSlot[];
  topics?: TopicSummary[];
  sessions?: Session[];
  groups?: Group[];
  groupAccessPath?: Group[];
  dateMode: "single" | "range";
  date?: Date[];
};

const defaultState: SessionQueryState = {
  dateMode: "single",
};

export const SessionQueryContext = createContext<{
  state: SessionQueryState;
  setState: (state: SessionQueryState) => void;
}>({
  state: defaultState,
  setState: () => {},
});

export const SessionQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<SessionQueryState>(defaultState);

  return (
    <SessionQueryContext.Provider value={{ state, setState }}>
      {children}
    </SessionQueryContext.Provider>
  );
};

export const useSessionQuery = () => useContext(SessionQueryContext);
