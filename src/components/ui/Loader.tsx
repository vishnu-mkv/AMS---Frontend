import { Loader as Loader1, Loader2 } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

export interface LoaderProps {
  asChild?: boolean;
  loading?: boolean;
  text?: string;
  type?: 1 | 2;
  className?: string;
}

const Loader = ({
  asChild = false,
  loading = false,
  text: loadingText = "",
  type,
  className = "",
}: LoaderProps) => {
  const Comp = asChild ? Slot : "span";
  const Loader = type === 1 ? Loader1 : Loader2;

  return (
    <>
      {loading && (
        <Comp
          className={clsx("text-gray-200 flex items-center gap-2", className)}
        >
          <Loader className={"h-4 w-4 animate-spin"} />
          {loadingText}
        </Comp>
      )}
    </>
  );
};
Loader.displayName = "Loader";

export { Loader };
