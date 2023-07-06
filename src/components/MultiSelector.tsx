import React from "react";
import { Label } from "./ui/label";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type MultiSelectorProps<T> = {
  renderItem: (item: T) => React.ReactNode;
  dialogContent: React.ReactNode;
  label: string;
} & (
  | {
      selectedItems: T[];
      setSelectedItems: (items: T[]) => void;
      mode?: "multiple";
    }
  | {
      selectedItem: T | undefined;
      mode: "single";
    }
);

function MultiSelector<T>(props: MultiSelectorProps<T>) {
  const { label, dialogContent, renderItem, mode } = props;

  return (
    <div className="space-y-5">
      <Label>{label}</Label>
      <div className="flex gap-5 justify-between items-strech">
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex flex-wrap gap-3 items-center grow  border border-input bg-slate-100 rounded-md p-2 cursor-pointer">
              {(!mode || mode === "multiple") &&
                props.selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 rounded-md bg-slate-50"
                  >
                    {renderItem(item)}
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.setSelectedItems(
                          props.selectedItems.filter(
                            (selectedItem) => selectedItem !== item
                          )
                        );
                      }}
                      className="p-1"
                    >
                      <XIcon className="text-red-400 w-4 h-4"></XIcon>
                    </Button>
                  </div>
                ))}
              {mode === "single" &&
                props.selectedItem &&
                renderItem(props.selectedItem)}
            </div>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
              <SearchIcon className="w-4 h-4"></SearchIcon>
            </Button>
          </DialogTrigger>
          <DialogContent className=" w-fit p-5 ">{dialogContent}</DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default MultiSelector;
