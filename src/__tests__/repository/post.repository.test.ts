import { v4 as uuidv4 } from 'uuid';
import { count, findAll } from '../../app/repositories/postRepository';
import { query } from '../../database/db';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

const mockedQuery = query as jest.Mock;

describe('postRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should fetch posts with pagination and orderBy ASC', async () => {
      const mockRows = [{ id: uuidv4(), title: 'Post 1' }];
      mockedQuery.mockResolvedValueOnce(mockRows);

      const params = {
        page: 1,
        limit: 10,
        orderBy: 'ASC' as 'ASC'
      };
      const result = await findAll(params);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [10, 0]
      );
      expect(result).toBe(mockRows);
    });

    it('should fetch posts with pagination and orderBy DESC', async () => {
      const mockRows = [{ id: uuidv4(), title: 'Post 2' }];
      mockedQuery.mockResolvedValueOnce(mockRows);

      const params = {
        page: 2,
        limit: 5,
        orderBy: 'DESC' as 'DESC'
      };
      const result = await findAll(params);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY'),
        [5, 5]
      );
      expect(result).toBe(mockRows);
    });

    it('should fetch posts filtering by userId', async () => {
      const mockRows = [{ id: uuidv4(), title: 'Post 3' }];
      mockedQuery.mockResolvedValueOnce(mockRows);
      const userId = uuidv4();
      const params = {
        page: 1,
        limit: 10,
        orderBy: 'ASC' as 'ASC',
        userId
      };
      const result = await findAll(params);
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('user_id'),
        [10, 0, userId]
      );
      expect(result).toBe(mockRows);
    });
  });

  describe('count', () => {
    it('should count posts without filters', async () => {
      mockedQuery.mockResolvedValueOnce([{ count: 42 }]);
      const result = await count();
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT'),
        []
      );
      expect(result).toBe(42);
    });

    it('should count posts filtering by userId', async () => {
      const userId = uuidv4();
      mockedQuery.mockResolvedValueOnce([{ count: 10 }]);
      const result = await count({ userId });
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('user_id'),
        [userId]
      );
      expect(result).toBe(10);
    });

    it('should count posts filtering by categoryId', async () => {
      const categoryId = uuidv4();
      mockedQuery.mockResolvedValueOnce([{ count: 5 }]);
      const result = await count({ categoryId });
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('category_id'),
        [categoryId]
      );
      expect(result).toBe(5);
    });

    it('should count posts filtering by createdAtStart', async () => {
      const createdAtStart = new Date();
      mockedQuery.mockResolvedValueOnce([{ count: 3 }]);
      const result = await count({ createdAtStart });
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('created_at >='),
        [createdAtStart]
      );
      expect(result).toBe(3);
    });

    it('should count posts filtering by createdAtEnd', async () => {
      const createdAtEnd = new Date();
      mockedQuery.mockResolvedValueOnce([{ count: 2 }]);
      const result = await count({ createdAtEnd });
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('created_at <='),
        [createdAtEnd]
      );
      expect(result).toBe(2);
    });

    it('should count posts filtering by isActive true', async () => {
      mockedQuery.mockResolvedValueOnce([{ count: 1 }]);
      const result = await count({ isActive: true });
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('is_active = $'),
        [true]
      );
      expect(result).toBe(1);
    });

    it('should count posts with all filters combined', async () => {
      const userId = uuidv4();
      const categoryId = uuidv4();
      const createdAtStart = new Date('2023-01-01');
      const createdAtEnd = new Date('2023-12-31');
      mockedQuery.mockResolvedValueOnce([{ count: 7 }]);
      const result = await count({
        userId,
        categoryId,
        createdAtStart,
        createdAtEnd,
        isActive: false
      });
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('user_id'),
        [userId, categoryId, createdAtStart, createdAtEnd, false]
      );
      expect(result).toBe(7);
    });
  });
});
