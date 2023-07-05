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

interface ListSelectorProps<T> {
  allowSelect?: boolean;

  onSelect?: (item: T[]) => void;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  selectedItems: T[];
}

type Checked = DropdownMenuCheckboxItemProps["checked"];

function ListSelector<T>({
  allowSelect = true,
  onSelect = ([]) => {},
  selectedItems,
  ...props
}: ListSelectorProps<T>) {
  const [itemsToShow, setItemsToShow] = useState<T[]>(props.items);
  const [showSelected, setShowSelected] = useState<Checked>(false);

  useEffect(() => {
    if (showSelected) {
      setItemsToShow(selectedItems);
    } else {
      setItemsToShow(props.items);
    }
  }, [showSelected, selectedItems, props.items]);

  useEffect(() => {
    if (onSelect) onSelect(selectedItems);
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
                  onSelect([...props.items]);
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
              checked={selectedItems.includes(item)}
              onCheckedChange={(e) => {
                if (e) {
                  onSelect([...selectedItems, item]);
                } else {
                  onSelect(selectedItems.filter((i) => i !== item));
                }
              }}
            />
          )}
          <div className="grow">{props.renderItem(item)}</div>
        </div>
      ))}
    </div>
  );
}

export default ListSelector;
