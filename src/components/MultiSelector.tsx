import React from "react";
import { Label } from "./ui/label";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type MultiSelectorProps<T> = {
  renderItem?: (item: T) => React.ReactNode;
  dialogContent: React.ReactNode;
  label: string;
  disabled?: boolean;
} & (
  | {
      selectedItems: T[];
      setSelectedItems?: (items: T[]) => void;
      mode?: "multiple";
      selectedShowMode?: "inline" | "block";
    }
  | {
      selectedItem: T | undefined;
      mode: "single";
    }
);

function MultiSelector<T>(props: MultiSelectorProps<T>) {
  const { label, dialogContent, renderItem, mode, disabled } = props;

  return (
    <div className="space-y-5">
      <Label>{label}</Label>
      <div className="flex gap-5 justify-between items-strech">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="max-w-[calc(100%-70px)] flex flex-wrap gap-3 items-center grow  border border-input bg-slate-100 rounded-md p-2 cursor-pointer disabled:cursor-not-allowed"
              disabled={disabled}
            >
              {mode === "single" &&
                renderItem &&
                props.selectedItem &&
                renderItem(props.selectedItem)}
              {(!mode || mode === "multiple") &&
                renderItem &&
                (props.selectedShowMode === "inline" ||
                  props.selectedShowMode === undefined) &&
                props.selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 rounded-md bg-slate-50"
                  >
                    {renderItem(item)}
                    {props.setSelectedItems && (
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!props.setSelectedItems) return;
                          props.setSelectedItems(
                            props.selectedItems.filter(
                              (selectedItem) => selectedItem !== item
                            )
                          );
                        }}
                        className="p-1 flex-shrink-0"
                      >
                        <XIcon className="text-red-400 w-4 h-4"></XIcon>
                      </Button>
                    )}
                  </div>
                ))}
            </button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant={"outline"} disabled={disabled}>
              <SearchIcon className="w-4 h-4"></SearchIcon>
            </Button>
          </DialogTrigger>
          <DialogContent className=" w-fit ">{dialogContent}</DialogContent>
        </Dialog>
      </div>
      {(!mode || mode === "multiple") &&
        renderItem &&
        props.selectedItems.length > 0 &&
        props.selectedShowMode === "block" && (
          <div className="space-y-3 pb-5">
            {props.selectedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-1 rounded-md bg-slate-200/80 p-2 px-4"
              >
                {renderItem(item)}
                {props.setSelectedItems && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!props.setSelectedItems) return;
                      props.setSelectedItems(
                        props.selectedItems.filter(
                          (selectedItem) => selectedItem !== item
                        )
                      );
                    }}
                    className="p-1 flex-shrink-0"
                  >
                    <XIcon className="text-red-400 w-4 h-4"></XIcon>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default MultiSelector;
