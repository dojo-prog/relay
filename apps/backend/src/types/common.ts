export interface PaginationResult {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface UpdateResult<T extends object> {
  old_values: Partial<T>;
  new_values: Partial<T>;
}
