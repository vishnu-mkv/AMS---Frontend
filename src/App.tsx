import Home from "@/pages/Home";
import Login from "./pages/Login";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Initiator from "./components/Initiator";
import RouteProtector from "./components/RouteProtector";
import UserList from "./pages/Users/UserList";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
