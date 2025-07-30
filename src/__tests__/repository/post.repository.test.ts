import {
  create,
  deleteById,
  findById
} from '../../app/repositories/postRepository';

import { mockPost } from '../../utils/mocks/mockPost';

import { v4 as uuidv4 } from 'uuid';

import { query } from '../../database/db';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

const mockedQuery = query as jest.Mock;

describe('postRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a POST when found by ID', async () => {
      mockedQuery.mockResolvedValueOnce(mockPost);

      const result = await findById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [mockPost.id]
      );
      expect(result).toEqual(mockPost);
    });

    it('should return null if no post is found', async () => {
      mockedQuery.mockResolvedValueOnce(null);

      const result = await findById(uuidv4());
      expect(result).toBeNull();
    });

    it('should include all necessary fields in SELECT query', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      await findById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /SELECT.*title.*content.*is_active.*user_id.*category_id.*created_at.*updated_at/
        ),
        [mockPost.id]
      );
    });

    it('should use WHERE id = $1 in query', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      await findById(mockPost.id);

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

      const result = await deleteById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM tb_post WHERE id = $1'),
        [mockPost.id]
      );
      expect(result).toEqual(mockResult);
    });

    it('should return empty array when no post is deleted', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      const result = await deleteById(uuidv4());

      expect(result).toEqual([]);
    });

    it('should use correct DELETE query', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      await deleteById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringMatching(/DELETE FROM tb_post/),
        [mockPost.id]
      );
    });

    it('should call query only once', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      await deleteById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error handling', () => {
    it('should propagate findById error', async () => {
      const errorMessage = 'Database connection error';
      mockedQuery.mockRejectedValueOnce(new Error(errorMessage));

      await expect(findById(mockPost.id)).rejects.toThrow(errorMessage);
    });

    it('should propagate deleteById error', async () => {
      const errorMessage = 'Database connection error';
      mockedQuery.mockRejectedValueOnce(new Error(errorMessage));

      await expect(deleteById(mockPost.id)).rejects.toThrow(errorMessage);
    });
  });

  describe('Parameter validation', () => {
    it('should pass ID as string to findById', async () => {
      mockedQuery.mockResolvedValueOnce([]);
      const testId = uuidv4();

      await findById(testId);

      expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), [testId]);
      expect(typeof mockedQuery.mock.calls[0][1][0]).toBe('string');
    });

    it('should pass ID as string to deleteById', async () => {
      mockedQuery.mockResolvedValueOnce([]);
      const testId = uuidv4();

      await deleteById(testId);

      expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), [testId]);
      expect(typeof mockedQuery.mock.calls[0][1][0]).toBe('string');
    });
  });

  describe('create', () => {
    it('deve inserir um post e retornar o resultado', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      const result = await create(
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
        create(
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

      await create(
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

      const result = await create(
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
