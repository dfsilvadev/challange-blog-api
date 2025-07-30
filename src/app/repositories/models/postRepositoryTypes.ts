interface FindAllParams {
  readonly page: number;
  readonly limit: number;
  readonly orderBy: 'ASC' | 'DESC';
  readonly userId?: string;
}

interface PostCountFilters {
  readonly categoryId?: string;
  readonly createdAtStart?: Date;
  readonly createdAtEnd?: Date;
  readonly isActive?: boolean;
  readonly userId?: string;
}

interface Pagination {
  total: number;
  totalPages: number;
  registersPerPage: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;
  firstPage: number;
  lastPage: number;
}

export { FindAllParams, Pagination, PostCountFilters };
