/**
 * The pagination envelope returned by list endpoints in the backend.
 *
 * Every list endpoint maps its result through the same shape, so consumers can
 * write one generic helper instead of matching each endpoint separately.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
