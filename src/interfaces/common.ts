type ListPropsWithSelect<T> = {
  allowSelect: true;
  onSelect: (items: T[]) => void;
  selectedItems: T[];
  mode?: "single" | "multiple";
};

export type ListProps<T> = ListPropsWithSelect<T> | { allowSelect?: false };

export interface PaginatedQuery {
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  search?: string;
  sort?: "createdAt" | "name";
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalPages: number;
  totalCount: number;
  page: number;
  limit: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
