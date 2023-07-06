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
import SessionSelector from "./pages/Attendance/SessionSelector";

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
        element: <SessionSelector />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
