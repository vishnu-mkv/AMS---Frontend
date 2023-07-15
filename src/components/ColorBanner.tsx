import { cn } from "@/lib/utils";
import React from "react";

interface ColorBannerProps {
  color?: string | null;
  imageUrl?: string | null;
  className?: string;
  children?: React.ReactNode;
}

function ColorBanner({
  color,
  imageUrl,
  className,
  children,
}: ColorBannerProps) {
  return (
    <div
      className={cn(
        "min-h-[12em] h-full w-full bg-gradient-to-t to-transparent from-gray-900/50 flex flex-col justify-end px-5 pb-2 last:pt-10",
        className
      )}
      style={{
        backgroundColor: imageUrl ? undefined : color ?? undefined,
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mt-auto">{children}</div>
    </div>
  );
}

export default ColorBanner;
