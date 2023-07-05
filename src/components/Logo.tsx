import { cn } from "@/lib/utils";

function Logo() {
  return (
    <legend className="text-lg flex items-center relative text-gray-100 font-medium">
      AMS
    </legend>
  );
}

export function Logo2({ className }: { className?: string }) {
  return (
    <div className={cn("bg-primary grid place-items-center", className)}>
      <legend
        className={cn(
          "text-4xl lg:max-w-[300px] flex items-center relative p-5  text-gray-100 font-bold leading-[1.4em]"
        )}
      >
        Attendance Management System
      </legend>
    </div>
  );
}

export default Logo;
