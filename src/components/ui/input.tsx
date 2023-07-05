"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface BaseInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    let content = (
      // <div className="grow mx-[4px]">
      <input
        type={showPassword ? "text" : type}
        className={cn(
          "flex h-10 w-full focus:w-[calc(100%-8px)] focus:mx-auto rounded-md border border-input bg-slate-100 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75 data-[invalid]:border-red-200",
          className
        )}
        ref={ref}
        {...props}
      />
      // </div>
    );

    if (type !== "password") return content;
    return (
      <div className="flex gap-3 items-center">
        {content}
        <div
          className="bg-slate-100 rounded-md p-2 cursor-pointer border border-input"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeIcon></EyeIcon> : <EyeOffIcon></EyeOffIcon>}
        </div>
      </div>
    );
  }
);
BaseInput.displayName = "Input";
