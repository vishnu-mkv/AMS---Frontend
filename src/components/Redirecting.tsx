import { ReactNode } from "react";

function Redirecting({ children }: { children?: ReactNode }) {
  return (
    <div className="h-[50vh] grid place-items-center content-center p-5 text-center">
      <h1 className="text-6xl font-bold text-gray-800">
        You are being redirected.
      </h1>
      <h2 className="text-gray-600 mt-5 mb-10">
        Please wait while we redirect you.
      </h2>
      {children && <div className="my-10">{children}</div>}
    </div>
  );
}

export default Redirecting;
