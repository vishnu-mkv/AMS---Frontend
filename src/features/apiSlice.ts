import { authAtom } from "@/atoms/UserAtom";
import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { getDefaultStore } from "jotai";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_URL as string,
  // credentials: "include",
  prepareHeaders: (headers) => {
    const store = getDefaultStore();
    const state = store.get(authAtom);

    const token = state?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryExtended = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    // api.dispatch(logOut());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryExtended,
  tagTypes: ["Users", "Roles", "Groups", "Schedules", "Topics", "Sessions"],
  endpoints: (builder) => ({}),
});
