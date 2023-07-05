import React from "react";
import { Button } from "./ui/Button";

function UnAuthorized() {
  return (
    <div className="h-[50vh] grid place-items-center content-center p-5 text-center">
      <h1 className="text-6xl font-bold text-gray-800">
        Seems like you got lost!
      </h1>
      <h2 className="text-gray-600 mt-5 mb-10">
        You are not authorized to view this page. Please login to continue. If
        you are already logged in, please contact support.
      </h2>

      <Button href="/">Go back to home</Button>
    </div>
  );
}

export default UnAuthorized;
