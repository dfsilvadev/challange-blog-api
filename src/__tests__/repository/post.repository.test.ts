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

  it('should return an existing post', async () => {
    (query as jest.Mock).mockResolvedValue([post1]);

    const result = await getPostById('1f5dcd7c-f7aa-4a14-b26b-b65282682ce6');

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT p.title, p.content'),
      ['1f5dcd7c-f7aa-4a14-b26b-b65282682ce6']
    );
    expect(result).toEqual(post1);
  });

  it('should return null because the post was not found', async () => {
    (query as jest.Mock).mockResolvedValue([]);

    const result = await getPostById('1f5dcd7c-f7aa-4a14-b26b-b65282682ce6');

    expect(result).toBeNull();
  });
});
