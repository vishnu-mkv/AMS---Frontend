import { useGetScheduleQuery } from "@/features/api/scheduleSlice";
import { Schedule } from "@/interfaces/schedule";
import { sortTimeSlots } from "@/lib/utils";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface ScheduleCreateorState {
  mode: "create" | "edit";
  schedule: Schedule;
  loading: boolean;
  error: any;
  page: 1 | 2;
  id: string;
}

const defaultState: ScheduleCreateorState = {
  mode: "create",
  schedule: {
    id: "",
    name: "",
    color: "",
    days: [],
    timeSlots: [],
    sessions: [],
  },
  loading: true,
  error: null,
  page: 1,
  id: "",
};

export const ScheduleCreateorContext = React.createContext<{
  state: ScheduleCreateorState;
  setState: (state: ScheduleCreateorState) => void;
  changePage: (page: 1 | 2) => void;
  changeToEdit: (id: string) => void;
}>({
  state: defaultState,
  setState: () => {},
  changePage: () => {},
  changeToEdit: () => {},
});

export function ScheduleCreateorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<ScheduleCreateorState>(defaultState);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, error, isLoading } = useGetScheduleQuery(state.id || "", {
    skip: !state.id,
  });

  useEffect(() => {
    if (data) {
      setState((prev) => ({
        ...prev,
        schedule: {
          ...data,
          timeSlots: sortTimeSlots(data.timeSlots),
        },
        loading: false,
      }));
    }

    if (error) {
      setState((prev) => ({
        ...prev,
        error,
        loading: false,
      }));
    }
  }, [data, error]);

  useEffect(() => {
    const id = searchParams.get("id");
    const page = searchParams.get("page") || "1";
    const _pageNumber = parseInt(page);
    const pageNumber = _pageNumber === 1 || _pageNumber === 2 ? _pageNumber : 1;
    setState((prev) => ({
      ...prev,
      page: pageNumber,
      id: id || "",
      mode: id ? "edit" : "create",
      loading: !!id && isLoading,
    }));
  }, [searchParams]);

  function changePage(page: 1 | 2) {
    setSearchParams({
      id: state.id,
      page: page.toString(),
    });
  }

  function changeToEdit(id: string) {
    setSearchParams({
      id,
      page: "2",
    });
  }

  return (
    <ScheduleCreateorContext.Provider
      value={{ state, setState, changePage, changeToEdit }}
    >
      {children}
    </ScheduleCreateorContext.Provider>
  );
}

export function useScheduleCreateor() {
  return React.useContext(ScheduleCreateorContext);
}

export default ScheduleCreateorContext;
