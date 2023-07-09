import { cn } from "@/lib/utils";
import React from "react";

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-7 max-w-[600px] mx-auto", className)}>
      {children}
    </div>
  );
}

export default Container;
