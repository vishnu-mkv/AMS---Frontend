import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  highlight?: string;
  className?: string;
  subtitleClassName?: string;
}

function Header({
  title,
  subtitle,
  highlight,
  className,
  subtitleClassName,
}: HeaderProps) {
  return (
    <div className={cn("my-5 sm:my-8", className)}>
      <h1 className="font-semibold text-3xl">{title}</h1>
      {subtitle && (
        <p className={cn("mt-1 text-gray-500 text-lg", subtitleClassName)}>
          {subtitle} <span className="text-primary">{highlight}</span>{" "}
        </p>
      )}
    </div>
  );
}

export default Header;
