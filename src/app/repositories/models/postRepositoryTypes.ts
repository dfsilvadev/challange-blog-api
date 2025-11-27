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
  readonly search?: string;
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
  readonly roleId: string;
}

interface CreateUserParams {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly passwordHash: string;
  readonly roleId: string;
}

interface UpdateUserParams {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
}

interface UserPassword {
  readonly id: string;
  readonly passwordHash: string;
}

interface UserWithPasswordHash extends User {
  readonly password_hash: string;
  readonly role_id: string;
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

// --- Comment Repository Types ---
interface Comment {
  readonly id: string;
  readonly content: string;
  readonly author: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly post_id: string;
}

interface CreateCommentParams {
  readonly content: string;
  readonly author: string;
  readonly post_id: string;
}

export {
  CreateUserParams,
  UpdateUserParams,
  FindAllParams,
  FindPostResponse,
  Post,
  PostCountFilters,
  Role,
  UserEntity,
  UserPassword,
  UserWithPasswordHash,
  FindFilters,
  Comment,
  CreateCommentParams
};
