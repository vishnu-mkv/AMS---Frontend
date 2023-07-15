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
import ScheduleViewer from "./pages/Schedules/ScheduleViewer";
import ScheduleCreator from "./pages/Schedules/ScheduleCreator";
import TopicCreator from "./pages/Topics/TopicCreator";
import TopicView from "./pages/Topics/TopicView";
import RoleView from "./pages/Roles/RoleView";
import RoleCreator from "./pages/Roles/RoleCreator";
import UserCreator from "./pages/Users/UserCreator";
import GroupView from "./pages/Groups/GroupView";
import UserView from "./pages/Users/UserView";
import GroupCreator from "./pages/Groups/GroupCreator";

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
        children: [
          {
            index: true,
            element: <UserList />,
          },
          {
            path: "create",
            element: <UserCreator />,
          },
          {
            path: ":id",
            element: <UserView />,
          },
        ],
      },
      {
        path: "roles",
        children: [
          {
            index: true,
            element: <RoleList />,
          },
          {
            path: ":id",
            element: <RoleView />,
          },
          {
            path: "create",
            element: <RoleCreator />,
          },
        ],
      },
      {
        path: "groups",
        children: [
          {
            index: true,
            element: <GroupList />,
          },
          {
            path: ":id",
            element: <GroupView />,
          },
          {
            path: "create",
            element: <GroupCreator />,
          },
        ],
      },
      {
        path: "schedules",
        children: [
          {
            index: true,
            element: <ScheduleList />,
          },
          {
            path: "create",
            element: <ScheduleCreator />,
          },
          {
            path: ":id",
            element: <ScheduleViewer />,
          },
        ],
      },
      {
        path: "topics",
        children: [
          {
            index: true,
            element: <TopicList />,
          },
          {
            path: ":id",
            element: <TopicView />,
          },
          {
            path: "create",
            element: <TopicCreator />,
          },
        ],
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
