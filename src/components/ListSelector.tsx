import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/Button";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from "./ui/checkbox";

interface ListSelectorPropsWithSelect<T> {
  allowSelect: true;
  onSelect: (item: T[]) => void;
  selectedItems: T[];
  isEqual: (x: T, y: T) => boolean;
  mode?: "single" | "multiple";
}

interface ListSelectorPropsWithoutSelect {
  allowSelect: false;
}

export type ListSelectorProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
} & (ListSelectorPropsWithSelect<T> | ListSelectorPropsWithoutSelect);

type Checked = DropdownMenuCheckboxItemProps["checked"];

function ListSelector<T>(props: ListSelectorProps<T>) {
  const { allowSelect, items, renderItem } = props;

  const onSelect = allowSelect ? props.onSelect : () => {};
  const selectedItems = allowSelect ? props.selectedItems : ([] as T[]);
  const mode = allowSelect ? props.mode : "multiple";

  const [itemsToShow, setItemsToShow] = useState<T[]>(props.items);
  const [showSelected, setShowSelected] = useState<Checked>(false);

  useEffect(() => {
    if (showSelected && allowSelect === true) {
      setItemsToShow(selectedItems);
    } else {
      setItemsToShow(items);
    }
  }, [showSelected, items]);

  useEffect(() => {
    if (allowSelect) {
      props.onSelect(props.selectedItems);
    }
  }, [selectedItems, onSelect]);

  return (
    <div className="space-y-5 my-7">
      {allowSelect && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {selectedItems.length} selected
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Show</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showSelected}
                onCheckedChange={setShowSelected}
              >
                Show selected only
              </DropdownMenuCheckboxItem>
              <DropdownMenuLabel>Selection</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  onSelect([...items]);
                }}
              >
                Select All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onSelect([]);
                }}
              >
                Deselect All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {itemsToShow.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {allowSelect && (
            <Checkbox
              checked={selectedItems.some((x) => props.isEqual(x, item))}
              onCheckedChange={(e) => {
                if (e) {
                  onSelect(
                    mode === "single" ? [item] : [...selectedItems, item]
                  );
                } else {
                  onSelect(
                    selectedItems.filter((i) => !props.isEqual(i, item))
                  );
                }
              }}
            />
          )}
          <div className="grow">{renderItem(item)}</div>
        </div>
      ))}
    </div>
  );
}

export default ListSelector;
