/**
 * Post Repository Types
 * Este arquivo define os tipos e interfaces usados no repositório de posts.
 */
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
  readonly passwordHash: string;
}

interface UserEntity extends User {
  readonly roleId: string;
}

/**
 * Role Repository Types
 * Este arquivo define os tipos e interfaces usados no repositório de papéis.
 */

interface RoleIdFound {
  readonly id: string;
}

export {
  CreateUserParams,
  FindAllParams,
  Pagination,
  PostCountFilters,
  RoleIdFound,
  UserEntity,
  UserPassword,
  UserWithPasswordHash
};
