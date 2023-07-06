type ListPropsWithSelect<T> = {
  allowSelect: true;
  onSelect: (items: T[]) => void;
  selectedItems: T[];
  mode?: "single" | "multiple";
};

export type ListProps<T> = ListPropsWithSelect<T> | { allowSelect?: false };
