/**
 * Post Repository Types
 * Este arquivo define os tipos e interfaces usados no repositório de posts.
 */
interface Post {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly is_active: boolean;
  readonly user_id: string;
  readonly category_id: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

interface FindPostResponse extends Post {
  readonly user_name: string;
  readonly category_name: string;
}

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

interface FindFilters {
  readonly page: number;
  readonly limit: number;
  readonly orderBy: 'ASC' | 'DESC';
  readonly categoryId?: string;
  readonly createdAtStart?: Date;
  readonly createdAtEnd?: Date;
  readonly isActive?: boolean;
  readonly userId?: string;
}

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

/**
 * User Repository Types
 * Este arquivo define os tipos e interfaces usados no repositório de usuários.
 */

interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly phone: string;
}

interface CreateUserParams {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly passwordHash: string;
  readonly roleId: string;
}

interface UserPassword {
  readonly id: string;
  readonly passwordHash: string;
}

interface UserWithPasswordHash extends User {
  readonly password_hash: string;
}

interface UserEntity extends User {
  readonly roleId: string;
}

/**
 * Role Repository Types
 * Este arquivo define os tipos e interfaces usados no repositório de papéis.
 */

interface Role {
  readonly id: string;
  readonly name: string;
  readonly created_at: Date;
  readonly updated_at: Date;
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

export {
  CreateUserParams,
  FindAllParams,
  FindPostResponse,
  Pagination,
  Post,
  PostCountFilters,
  Role,
  UserEntity,
  UserPassword,
  UserWithPasswordHash,
  FindFilters,
  getPagination
};
