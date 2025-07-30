import {
  findById,
  deleteById,
  create
} from '../../app/repositories/postRepository';

import { mockPost } from '../../utils/mocks/mockPost';

import { query } from '../../database/db';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

const mockedQuery = query as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('postRepository', () => {
  describe('findById', () => {
    it('deve retornar um POST quando encontrado por ID', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      const result = await findById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [mockPost.id]
      );
      expect(result).toEqual(mockPost);
    });

    it('deve retornar null se nenhum post for encontrado', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      const result = await findById(uuidv4());
      expect(result).toBeNull();
    });
  });

  describe('deleteById', () => {
    it('deve deletar um POST por ID', async () => {
      mockedQuery.mockResolvedValueOnce([mockPost]);

      const result = await deleteById(mockPost.id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM'),
        [mockPost.id]
      );
      expect(result).toEqual(mockPost);
    });

    it('deve retornar undefined se nenhum post for encontrado para deletar', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      const result = await deleteById(uuidv4());
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('deve inserir um post e devolver o resultado', async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockPost]);

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

      expect(result).toEqual(mockPost);
    });
  });
});
