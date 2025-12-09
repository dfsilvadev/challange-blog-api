export interface FindFilters {
  readonly page: number;
  readonly limit: number;
  readonly orderBy: 'ASC' | 'DESC';
  readonly roleName?: string;
  readonly name?: string;
  readonly email?: string;
  readonly isActive?: boolean;
}
