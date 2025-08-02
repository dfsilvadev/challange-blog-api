interface Pagination {
  readonly total: number;
  readonly totalPages: number;
  readonly registersPerPage: number;
  readonly currentPage: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly nextPage: number;
  readonly previousPage: number;
  readonly firstPage: number;
  readonly lastPage: number;
}

// Função para paginar
function getPagination(
  total: number,
  currentPage: number,
  currentLimit: number
): Pagination {
  const totalPages = Math.ceil(total / currentLimit);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    total,
    totalPages,
    registersPerPage: currentLimit,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? currentPage + 1 : 0,
    previousPage: hasPreviousPage ? currentPage - 1 : 0,
    firstPage: currentPage > 1 ? 1 : 0,
    lastPage: currentPage < totalPages ? totalPages : 0
  };
}
export { getPagination };
