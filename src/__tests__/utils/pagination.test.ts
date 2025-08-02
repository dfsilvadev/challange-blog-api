import { getPagination } from '../../utils/pagination/pagination';

describe('getPagination', () => {
  it('deve retornar os valores corretos para a primeira página', () => {
    const result = getPagination(100, 1, 10);

    expect(result).toEqual({
      total: 100,
      totalPages: 10,
      registersPerPage: 10,
      currentPage: 1,
      hasNextPage: true,
      hasPreviousPage: false,
      nextPage: 2,
      previousPage: 0,
      firstPage: 0,
      lastPage: 10
    });
  });

  it('deve retornar os valores corretos para a última página', () => {
    const result = getPagination(100, 10, 10);

    expect(result).toEqual({
      total: 100,
      totalPages: 10,
      registersPerPage: 10,
      currentPage: 10,
      hasNextPage: false,
      hasPreviousPage: true,
      nextPage: 0,
      previousPage: 9,
      firstPage: 1,
      lastPage: 0
    });
  });

  it('deve retornar os valores corretos para uma página intermediária', () => {
    const result = getPagination(50, 3, 10);

    expect(result).toEqual({
      total: 50,
      totalPages: 5,
      registersPerPage: 10,
      currentPage: 3,
      hasNextPage: true,
      hasPreviousPage: true,
      nextPage: 4,
      previousPage: 2,
      firstPage: 1,
      lastPage: 5
    });
  });

  it('deve lidar corretamente com total menor que o limite', () => {
    const result = getPagination(5, 1, 10);

    expect(result).toEqual({
      total: 5,
      totalPages: 1,
      registersPerPage: 10,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: 0,
      previousPage: 0,
      firstPage: 0,
      lastPage: 0
    });
  });
});
