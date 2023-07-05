import { ReactNode } from "react";
import { Button } from "./ui/Button";

function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div className="h-[50vh] grid place-items-center content-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-gray-600 mt-5 mb-10">
        Sorry the page you are looking for does not exist.
      </h2>
      {children && <div className="my-10">{children}</div>}
      <Button href="/">Go back to home</Button>
    </div>
  );
}

export default NotFound;
