import React, { useState } from "react";
import { BaseInput, BaseInputProps } from "./input";

interface DebouncedInputProps extends BaseInputProps {
  delay?: number;
  onValueChange?: (value: string) => void;
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  delay = 500,
  onValueChange,
  ...props
}: DebouncedInputProps) => {
  const [timeoutId, setTimeoutId] = useState<any>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (timeoutId) clearTimeout(timeoutId);
    setTimeoutId(setTimeout(() => onValueChange?.(newValue), delay));
  };

  return <BaseInput {...props} onChange={handleChange} />;
};

export default DebouncedInput;
