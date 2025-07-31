jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

import { findIdByName } from '../../app/repositories/roleRepository';
import { query } from '../../database/db';

describe('findIdByName', () => {
  it('should return the id when found in the database', async () => {
    (query as jest.Mock).mockResolvedValue([{ id: 'role-123' }]);

    const result = await findIdByName('admin');

    expect(query).toHaveBeenCalledWith(expect.any(String), ['admin']);
    expect(result).toBe('role-123');
  });

  it('should return an empty string if rows[0].id is false', async () => {
    (query as jest.Mock).mockResolvedValue([{}]);

    const result = await findIdByName('no-id');

    expect(result).toBe('');
  });
});
