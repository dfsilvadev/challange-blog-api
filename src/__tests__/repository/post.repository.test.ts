import { create } from '../../app/repositories/postRepository';
import { query } from '../../database/db';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

describe('postRepository', () => {
  describe('create', () => {
    it('deve inserir um post e devolver o resultado', async () => {
      const mockPost = {
        id: '1',
        title: 'Título',
        content: 'Conteúdo',
        is_active: true,
        user_id: '123',
        category_id: '456'
      };

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
