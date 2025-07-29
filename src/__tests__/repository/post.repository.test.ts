import { findById, deleteById } from '../../app/repositories/postRepository';

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
});
