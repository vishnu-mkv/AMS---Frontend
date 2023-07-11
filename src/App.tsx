import Home from "@/pages/Home";
import Login from "./pages/Login";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Initiator from "./components/Initiator";
import RouteProtector from "./components/RouteProtector";
import UserList from "./pages/Users/UserList";
import RoleList from "./pages/Roles/RoleList";
import GroupList from "./pages/Groups/GroupList";
import ScheduleList from "./pages/Schedules/ScheduleList";
import TopicList from "./pages/Topics/TopicList";
import AttendanceTaker from "./pages/Attendance/AttendanceTaker";
import RecordView from "./pages/Records/RecordView";
import RecordEntryView from "./pages/Records/RecordEntryView";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Initiator>
        <RouteProtector>
          <Navbar />,
        </RouteProtector>
      </Initiator>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "users",
        element: <UserList />,
      },
      {
        path: "roles",
        element: <RoleList />,
      },
      {
        path: "groups",
        element: <GroupList />,
      },
      {
        path: "schedules",
        element: <ScheduleList />,
      },
      {
        path: "topics",
        element: <TopicList />,
      },
      {
        path: "attendance",
        children: [
          {
            index: true,
            element: <AttendanceTaker />,
          },
        ],
      },
      {
        path: "records",
        children: [
          {
            index: true,
            element: <RecordView />,
          },
          {
            path: ":id",
            element: <RecordEntryView />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
