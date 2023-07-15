import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { cn, getErrorMessage } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
  {
    variants: {
      variant: {
        default: "bg-green-400 text-foreground",
        destructive:
          "text-white bg-red-500 border-red-500/50 dark:border-red-500 [&>svg]:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-2 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed mt-2", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export const Message = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & { title?: string; message: string }
>(({ className, variant = "default", title = "", message, ...props }, ref) => {
  if (!message) return <></>;

  return (
    <Alert
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {variant === "destructive" && <AlertCircle className="h-4 w-4" />}
      {variant === "default" && <Check className="h-4 w-4" />}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription
        className={variant === "default" ? "text-gray-700" : "text-slate-300"}
      >
        {message}
      </AlertDescription>
    </Alert>
  );
});

Message.displayName = "Message";

export const ErrorMessage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { error?: any }
>(({ className, error, title, ...props }, ref) => {
  return (
    <Message
      ref={ref}
      className={cn("bg-red-500 text-white border-red-500/50", className)}
      message={error ? getErrorMessage(error) : ""}
      title={title || "Something went wrong"}
      variant={"destructive"}
      {...props}
    />
  );
});

export { Alert, AlertTitle, AlertDescription };
