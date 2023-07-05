import { authAtom, authStatusAtom, intializeAtom } from "@/atoms/UserAtom";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import Loading from "./Loading";

function Initiator({ children }: { children: React.ReactNode }) {
  const [authStatus] = useAtom(authStatusAtom);
  const [_, setAuth] = useAtom(authAtom);
  const [initialized, setInitialize] = useAtom(intializeAtom);

  useEffect(() => {
    if (initialized) {
      return;
    }

    // read user from local storage
    // if user is found, set authStatus to authenticated
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);

      if (parsedUser.token && parsedUser.user) {
        setAuth(parsedUser);
      }
    }

    // set initialize to false
    setInitialize(true);
  }, [initialized]);

  if (authStatus === "loading") {
    return <Loading />;
  }

  return children;
}

export default Initiator;
