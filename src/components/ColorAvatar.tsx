import React from "react";

function ColorAvatar({ color }: { color?: string | null }) {
  return (
    <div
      className="rounded-full w-10 h-10 bg-bgs"
      style={
        color
          ? {
              backgroundColor: color,
            }
          : {}
      }
    ></div>
  );
}

export default ColorAvatar;
