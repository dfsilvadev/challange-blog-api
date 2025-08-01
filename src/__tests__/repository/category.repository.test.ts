import { findById } from '../../app/repositories/categoryRepository';
import { query } from '../../database/db';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

describe('findById', () => {
  it('should return true when the record exists', async () => {
    (query as jest.Mock).mockResolvedValue([{ exists: true }]);

    const result = await findById('some-id');

    expect(result).toBe(true);
    expect(query).toHaveBeenCalledWith(expect.any(String), ['some-id']);
  });

  it('should return false when the record does not exist', async () => {
    (query as jest.Mock).mockResolvedValue([{ exists: false }]);

    const result = await findById('another-id');

    expect(result).toBe(false);
    expect(query).toHaveBeenCalledWith(expect.any(String), ['another-id']);
  });

  it('should return false if result[0] is undefined', async () => {
    (query as jest.Mock).mockResolvedValue([]);

    const result = await findById('missing-id');

    expect(result).toBe(false);
  });
});
