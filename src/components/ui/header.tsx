import { cn } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import { Button } from "./Button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  highlight?: string;
  className?: string;
  subtitleClassName?: string;
  editUrl?: string;
}

function Header({
  title,
  subtitle,
  highlight,
  className,
  subtitleClassName,
  editUrl,
}: HeaderProps) {
  return (
    <div className={cn("my-5 sm:my-8", className)}>
      <div className="flex gap-2 items-center justify-between">
        <h1 className="font-semibold text-3xl">{title}</h1>
        {editUrl && (
          <Button variant="ghost" href={editUrl}>
            <PencilIcon size="14" className="fill-white"></PencilIcon>
          </Button>
        )}
      </div>
      {subtitle && (
        <p className={cn("mt-1 text-gray-500 text-lg", subtitleClassName)}>
          {subtitle} <span className="text-primary">{highlight}</span>{" "}
        </p>
      )}
    </div>
  );
}

export default Header;
