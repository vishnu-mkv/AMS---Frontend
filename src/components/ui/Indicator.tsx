import { Button } from "./Button";

export function Indicator({ isFetching }: { isFetching: boolean }) {
  return (
    <Button
      variant="ghost"
      className="pointer-events-none cursor-default disabled:opacity-100 "
      loader={{
        loading: isFetching,
        text: "Please Wait...",
        className: "text-slate-900",
      }}
    >
      <div className="w-3 h-3 mr-3 rounded-full bg-green-400"></div>
      Idle
    </Button>
  );
}
