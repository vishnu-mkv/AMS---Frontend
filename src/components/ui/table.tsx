import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface TableContextProps {
  showBorder: boolean;
  centerHeader: boolean;
  showHeaderBg: boolean;
}

const TableContext = createContext<TableContextProps>({
  showBorder: false,
  centerHeader: false,
  showHeaderBg: false,
});

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  showBorder?: boolean;
  centerHeader?: boolean;
  showHeaderBg?: boolean;
}

const Table: React.FC<TableProps> = ({
  showBorder = false,
  centerHeader = false,
  showHeaderBg = false,
  className,
  ...props
}) => {
  return (
    <div className="w-full overflow-auto">
      <TableContext.Provider value={{ showBorder, centerHeader, showHeaderBg }}>
        <table
          className={cn(
            "w-full caption-bottom text-sm",
            showBorder && "border ",
            className
          )}
          {...props}
        />
      </TableContext.Provider>
    </div>
  );
};

const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => {
  const { showHeaderBg } = useContext(TableContext);

  return (
    <thead
      className={cn("border-b", showHeaderBg && "bg-gray-300/20", className)}
      {...props}
    />
  );
};

const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => {
  return <tbody className={cn("border-b ", className)} {...props} />;
};

const TableFooter: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => {
  const { showBorder } = useContext(TableContext);

  return (
    <tfoot
      className={cn(
        "bg-primary font-medium text-primary-foreground",
        showBorder && "border ",
        className
      )}
      {...props}
    />
  );
};

const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  ...props
}) => {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  );
};

const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  ...props
}) => {
  const { showBorder, centerHeader } = useContext(TableContext);

  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        showBorder && "border-r ",
        centerHeader && "text-center",

        className
      )}
      {...props}
    />
  );
};

const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  ...props
}) => {
  const { showBorder } = useContext(TableContext);

  return (
    <td
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        showBorder && "border",
        className
      )}
      {...props}
    />
  );
};

const TableCaption: React.FC<React.HTMLAttributes<HTMLTableCaptionElement>> = ({
  className,
  ...props
}) => {
  return (
    <caption
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
