import { findIdByName } from '../../app/repositories/roleRepository';
import { query } from '../../database/db';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

describe('findIdByName', () => {
  it('deve retornar o id quando encontrado no banco', async () => {
    (query as jest.Mock).mockResolvedValue([{ id: 'role-123' }]);

    const result = await findIdByName('admin');

    expect(query).toHaveBeenCalledWith(expect.any(String), ['admin']);
    expect(result).toBe('role-123');
  });

  it('deve retornar string vazia se rows[0].id for false', async () => {
    (query as jest.Mock).mockResolvedValue([{}]);

    const result = await findIdByName('no-id');

    expect(result).toBe('');
  });
});
