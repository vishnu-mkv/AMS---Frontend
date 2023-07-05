import React from "react";
import { NavItem } from "../Navbar";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { cn } from "@/lib/utils";

interface HelpTextProps extends React.InputHTMLAttributes<HTMLAnchorElement> {
  link?: NavItem | { text: string; onClick?: () => void };
  query?: string;
  className?: string;
}

function HelpText({ link, query, className, ...props }: HelpTextProps) {
  return (
    <p className={cn(clsx("text-slate-800 text-sm", className))}>
      {query}{" "}
      {link && (link as any)?.href && (
        <Link to={(link as any).href} className="text-primary" {...props}>
          {link.text}
        </Link>
      )}
      {link && (link as any)?.onClick && (
        <span
          onClick={link.onClick}
          className="text-primary cursor-pointer"
          {...props}
        >
          {link.text}
        </span>
      )}
    </p>
  );
}

export default HelpText;
