import { findById } from '../../app/repositories/categoryRepository';
import { query } from '../../database/db';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

describe('findById', () => {
  it('deve retornar true quando o registro existir', async () => {
    (query as jest.Mock).mockResolvedValue([{ exists: true }]);

    const result = await findById('some-id');

    expect(result).toBe(true);
    expect(query).toHaveBeenCalledWith(expect.any(String), ['some-id']);
  });

  it('deve retornar false quando o registro não existir', async () => {
    (query as jest.Mock).mockResolvedValue([{ exists: false }]);

    const result = await findById('another-id');

    expect(result).toBe(false);
    expect(query).toHaveBeenCalledWith(expect.any(String), ['another-id']);
  });

  it('deve retornar false se result[0] for undefined', async () => {
    (query as jest.Mock).mockResolvedValue([]);

    const result = await findById('missing-id');

    expect(result).toBe(false);
  });
});
