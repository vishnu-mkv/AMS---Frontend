import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader, LoaderProps } from "./Loader";
import { Link } from "react-router-dom";
import React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-80  disabled:cursor-not-allowed ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-slate-100 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
      width: {
        default: "",
        minWidth: "min-w-[100px]",
        fullWidth: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  loader?: LoaderProps;
}

const Button = React.forwardRef<HTMLInputElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      width,
      asChild = false,
      href,
      children,
      loader,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : href ? Link : "button";
    const loading = loader && loader.loading;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className, width }))}
        {...props}
        disabled={props.disabled || loading}
        to={href || ""}
        ref={ref as any}
      >
        <Loader {...loader}></Loader>
        {!loading && children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
