import { v4 as uuidv4 } from 'uuid';

import * as postRepository from '../../app/repositories/postRepository';

import { mockPost } from '../../utils/mocks/mockPost';

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
      const result = await postRepository.findAll(params);

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
      const result = await postRepository.findAll(params);

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
      const result = await postRepository.findAll(params);
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
      const result = await postRepository.count();
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT'),
        []
      );
      expect(result).toBe(42);
    });

    it('should count posts filtering by userId', async () => {
      const userId = uuidv4();
      mockedQuery.mockResolvedValueOnce([{ count: 10 }]);
      const result = await postRepository.count({ userId });
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('user_id'),
        [userId]
      );
      expect(result).toBe(10);
    });

    it('should count posts filtering by categoryId', async () => {
      const categoryId = uuidv4();
      mockedQuery.mockResolvedValueOnce([{ count: 5 }]);
      const result = await postRepository.count({ categoryId });
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('category_id'),
        [categoryId]
      );
      expect(result).toBe(5);
    });

    it('should count posts filtering by createdAtStart', async () => {
      const createdAtStart = new Date();
      mockedQuery.mockResolvedValueOnce([{ count: 3 }]);
      const result = await postRepository.count({ createdAtStart });
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('created_at >='),
        [createdAtStart]
      );
      expect(result).toBe(3);
    });

    it('should count posts filtering by createdAtEnd', async () => {
      const createdAtEnd = new Date();
      mockedQuery.mockResolvedValueOnce([{ count: 2 }]);
      const result = await postRepository.count({ createdAtEnd });
      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('created_at <='),
        [createdAtEnd]
      );
      expect(result).toBe(2);
    });

    it('should count posts filtering by isActive true', async () => {
      mockedQuery.mockResolvedValueOnce([{ count: 1 }]);
      const result = await postRepository.count({ isActive: true });
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
      const result = await postRepository.count({
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

  describe('findById', () => {
    it('should return a POST when found by ID', async () => {
      mockedQuery.mockResolvedValueOnce(mockPost);

      const result = await postRepository.findById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [mockPost.id]
      );
      expect(result).toEqual(mockPost);
    });

    it('should return null if no post is found', async () => {
      mockedQuery.mockResolvedValueOnce(null);

      const result = await postRepository.findById(uuidv4());
      expect(result).toBeNull();
    });

    it('should include all necessary fields in SELECT query', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      await postRepository.findById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /SELECT.*title.*content.*is_active.*user_id.*category_id.*created_at.*updated_at/
        ),
        [mockPost.id]
      );
    });

    it('should use WHERE id = $1 in query', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      await postRepository.findById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE p.id = $1'),
        [mockPost.id]
      );
    });
  });

  describe('deleteById', () => {
    it('should execute DELETE with correct ID', async () => {
      const mockResult = [{ id: mockPost.id }];
      mockedQuery.mockResolvedValueOnce(mockResult);

      const result = await postRepository.deleteOne(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM tb_post WHERE id = $1'),
        [mockPost.id]
      );
      expect(result).toEqual(mockResult);
    });

    it('should return empty array when no post is deleted', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      const result = await postRepository.deleteOne(uuidv4());

      expect(result).toEqual([]);
    });

    it('should use correct DELETE query', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      await postRepository.deleteOne(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringMatching(/DELETE FROM tb_post/),
        [mockPost.id]
      );
    });

    it('should call query only once', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      await postRepository.deleteOne(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error handling', () => {
    it('should propagate findById error', async () => {
      const errorMessage = 'Database connection error';
      mockedQuery.mockRejectedValueOnce(new Error(errorMessage));

      await expect(postRepository.findById(mockPost.id)).rejects.toThrow(
        errorMessage
      );
    });

    it('should propagate deleteById error', async () => {
      const errorMessage = 'Database connection error';
      mockedQuery.mockRejectedValueOnce(new Error(errorMessage));

      await expect(postRepository.deleteOne(mockPost.id)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe('Parameter validation', () => {
    it('should pass ID as string to findById', async () => {
      mockedQuery.mockResolvedValueOnce([]);
      const testId = uuidv4();

      await postRepository.findById(testId);

      expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), [testId]);
      expect(typeof mockedQuery.mock.calls[0][1][0]).toBe('string');
    });

    it('should pass ID as string to deleteById', async () => {
      mockedQuery.mockResolvedValueOnce([]);
      const testId = uuidv4();

      await postRepository.deleteOne(testId);

      expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), [testId]);
      expect(typeof mockedQuery.mock.calls[0][1][0]).toBe('string');
    });
  });

  describe('create', () => {
    it('deve inserir um post e retornar o resultado', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      const result = await postRepository.create(
        mockPost.title,
        mockPost.content,
        mockPost.is_active,
        mockPost.user_id,
        mockPost.category_id
      );

      expect(query).toHaveBeenCalledWith(
        `
        INSERT INTO tb_post(title, content, is_active, user_id, category_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
          mockPost.title,
          mockPost.content,
          mockPost.is_active,
          mockPost.user_id,
          mockPost.category_id
        ]
      );

      expect(result).toEqual([mockPost]);
    });

    it('deve propagar erro do banco de dados', async () => {
      const errorMessage = 'Erro de banco';
      mockedQuery.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        postRepository.create(
          mockPost.title,
          mockPost.content,
          mockPost.is_active,
          mockPost.user_id,
          mockPost.category_id
        )
      ).rejects.toThrow(errorMessage);
    });

    it('deve passar os parâmetros corretamente para o query', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      await postRepository.create(
        mockPost.title,
        mockPost.content,
        mockPost.is_active,
        mockPost.user_id,
        mockPost.category_id
      );

      expect(query).toHaveBeenCalledWith(expect.any(String), [
        mockPost.title,
        mockPost.content,
        mockPost.is_active,
        mockPost.user_id,
        mockPost.category_id
      ]);
    });

    it('deve retornar um array com o post criado', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      const result = await postRepository.create(
        mockPost.title,
        mockPost.content,
        mockPost.is_active,
        mockPost.user_id,
        mockPost.category_id
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockPost);
    });
  });
});
