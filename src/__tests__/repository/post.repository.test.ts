jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

import { post1 } from '../../mocks/modulePosts';
import { getPostById } from '../../app/repositories/postRepository';
import { query } from '../../database/db';

describe('postRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar um post existente', async () => {
    (query as jest.Mock).mockResolvedValue([post1]);

    const result = await getPostById('1f5dcd7c-f7aa-4a14-b26b-b65282682ce6');

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining(
        'SELECT title, content, is_active, user_id, category_id, created_at, updated_at'
      ),
      ['1f5dcd7c-f7aa-4a14-b26b-b65282682ce6']
    );
    expect(result).toEqual(post1);
  });

  it('deve retornar null pois o post não foi encontrado', async () => {
    (query as jest.Mock).mockResolvedValue([]);

    const result = await getPostById('1f5dcd7c-f7aa-4a14-b26b-b65282682ce6');

    expect(result).toBeNull();
  });
});
