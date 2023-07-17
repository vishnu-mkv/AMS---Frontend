import { cn } from "@/lib/utils";

function ColorAvatar({
  color,
  className,
}: {
  color?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-full w-10 h-10 bg-bgs", className)}
      style={
        color
          ? {
              backgroundColor: color,
            }
          : {}
      }
    ></div>
  );
}

export default ColorAvatar;
