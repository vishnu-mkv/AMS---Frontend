import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import ColorAvatar from "./ColorAvatar";
import Header from "./ui/header";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "./ui/Button";

interface ColorPickerProps {
  color?: string | null;
  setColor?: (color: string) => void;
  className?: string;
}

const colors = [
  "#F87171",
  "#FBBF24",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
  "#FCD34D",
  "#6EE7B7",
  "#93C5FD",
  "#D1D5DB",
];

function ColorPicker({ color, setColor, className }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="block mx-auto">
          <ColorAvatar color={color} className={cn("w-20 h-20", className)} />
        </button>
      </DialogTrigger>
      <DialogContent className="!max-w-[500px]">
        <DialogTitle asChild>
          <Header title="Choose a color"></Header>
        </DialogTitle>
        <div className="flex flex-wrap gap-4 mt-5">
          {colors.map((color) => (
            <div
              onClick={() => {
                setOpen(false);
                setColor && setColor(color);
              }}
              key={color}
              className={cn(
                "cursor-pointer",
                color === color
                  ? "ring-2 ring-offset-2 ring-offset-white ring-white"
                  : "ring-2 ring-offset-2 ring-offset-white ring-transparent"
              )}
            >
              <ColorAvatar color={color} />
            </div>
          ))}
        </div>
        <DialogClose className="mt-10">
          <Button variant={"outline"}>Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default ColorPicker;
