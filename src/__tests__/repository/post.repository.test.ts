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
    it('should return posts with default params', async () => {
      const posts = [mockPost];
      mockedQuery.mockResolvedValueOnce(posts);
      const result = await postRepository.findAll({
        page: 1,
        limit: 10,
        orderBy: 'ASC',
        userId: undefined
      });
      expect(result).toEqual(posts);
      expect(mockedQuery).toHaveBeenCalled();
    });

    it('should return posts filtered by userId', async () => {
      const posts = [mockPost];
      mockedQuery.mockResolvedValueOnce(posts);
      const result = await postRepository.findAll({
        page: 1,
        limit: 10,
        orderBy: 'ASC',
        userId: mockPost.user_id
      });
      expect(result).toEqual(posts);
      expect(mockedQuery).toHaveBeenCalled();
      const [[sql, params]] = mockedQuery.mock.calls;
      expect(sql).toContain('tb_post.user_id = $3::uuid');
      expect(params).toContain(mockPost.user_id);
    });

    it('should return paginated posts', async () => {
      const posts = [mockPost];
      mockedQuery.mockResolvedValueOnce(posts);
      const result = await postRepository.findAll({
        page: 2,
        limit: 5,
        orderBy: 'DESC',
        userId: undefined
      });
      expect(result).toEqual(posts);
      expect(mockedQuery).toHaveBeenCalled();
      const [[sql, params]] = mockedQuery.mock.calls;
      expect(sql).toContain('ORDER BY');
      expect(sql).toContain('DESC');
      expect(params[0]).toBe(5); // limit
      expect(params[1]).toBe(5); // offset
    });

    it('should return empty array if userId does not exist', async () => {
      mockedQuery.mockResolvedValueOnce([]);
      const result = await postRepository.findAll({
        page: 1,
        limit: 10,
        orderBy: 'ASC',
        userId: 'non-existent-user'
      });
      expect(result).toEqual([]);
    });

    it('should propagate database error', async () => {
      mockedQuery.mockRejectedValueOnce(new Error('DB error'));
      await expect(
        postRepository.findAll({
          page: 1,
          limit: 10,
          orderBy: 'ASC',
          userId: undefined
        })
      ).rejects.toThrow('DB error');
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
      mockedQuery.mockResolvedValueOnce([mockPost]);

      const result = await postRepository.findById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [mockPost.id]
      );
      expect(result).toEqual(mockPost);
    });

    it('should return undefined if no post is found', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      const result = await postRepository.findById(uuidv4());
      expect(result).toBeUndefined();
    });

    it('should include all necessary fields in SELECT query', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      await postRepository.findById(mockPost.id);

      const expectedQuerySubstring = `
    SELECT tb_post.id, tb_post.title, tb_post.content, tb_post.is_active, tb_post.created_at, tb_post.updated_at, tb_post.user_id, tb_user.name AS "user_name", tb_post.category_id, tb_category.name AS "category_name" FROM tb_post INNER JOIN tb_user ON tb_user.id = tb_post.user_id INNER JOIN tb_category ON tb_category.id = tb_post.category_id WHERE tb_post.id = $1 AND tb_post.is_active = true
  `
        .trim()
        .replace(/\s+/g, ' ');

      const actualQuery = mockedQuery.mock.calls[0][0]
        .trim()
        .replace(/\s+/g, ' ');

      expect(actualQuery).toContain(expectedQuerySubstring);
      expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), [
        mockPost.id
      ]);
    });

    it('should use WHERE id = $1 in query', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      await postRepository.findById(mockPost.id);

      const [sql, params] = mockedQuery.mock.calls[0];

      expect(sql).toMatch(
        /WHERE\s+tb_post\.id\s*=\s*\$1\s+AND\s+tb_post\.is_active\s*=\s*true/
      );

      expect(params).toEqual([mockPost.id]);
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
    it('should insert a post and return the result', async () => {
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

      expect(result).toEqual(mockPost);
    });

    it('should propagate database error', async () => {
      const errorMessage = 'Database error';
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

    it('should pass parameters correctly to the query', async () => {
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

    it('should return an array with the created post', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      const resp = await postRepository.create(
        mockPost.title,
        mockPost.content,
        mockPost.is_active,
        mockPost.user_id,
        mockPost.category_id
      );

      expect(resp).toEqual(mockPost);
    });
  });

  it('should throw error if no fields are provided for update', async () => {
    await expect(postRepository.update('some-id', {})).rejects.toThrow(
      'Nenhum campo fornecido para atualização'
    );
  });

  describe('deleteOne', () => {
    it('should propagate database error', async () => {
      mockedQuery.mockRejectedValueOnce(new Error('DB error'));
      await expect(postRepository.deleteOne('any-id')).rejects.toThrow(
        'DB error'
      );
    });
  });

  describe('update', () => {
    it('should return null if id does not exist', async () => {
      mockedQuery.mockResolvedValueOnce([]);
      const result = await postRepository.update('non-existent-id', {
        title: 'Novo título'
      });
      expect(result).toBeUndefined();
    });

    it('should propagate database error', async () => {
      mockedQuery.mockRejectedValueOnce(new Error('DB error'));
      await expect(
        postRepository.update('any-id', { title: 'Novo título' })
      ).rejects.toThrow('DB error');
    });
  });
});
