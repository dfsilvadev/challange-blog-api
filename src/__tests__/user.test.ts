import { findUserByEmailOrName } from '../app/repositories/userRepository';
import { query } from '../database/db';

jest.mock('../database/db', () => ({
  query: jest.fn()
}));

describe('findUserByEmailOrName', () => {
  it('deve retornar um usuário quando encontrado por e-mail ou nome', async () => {
    const mockUser = {
      id: process.env.USER_ID,
      email: process.env.USER_EMAIL,
      name: process.env.USER_NAME,
      phone: process.env.USER_PHONE,
      password_hash: process.env.USER_PASSWORD
    };

    (query as jest.Mock).mockResolvedValue([mockUser]);

    const result = await findUserByEmailOrName(
      process.env.USER_EMAIL || process.env.USER_NAME || ''
    );
    expect(result).toEqual(mockUser);
  });

  it('deve retornar null quando nenhum usuário é encontrado', async () => {
    (query as jest.Mock).mockResolvedValue([]);

    const result = await findUserByEmailOrName(
      process.env.USER_WRONG_EMAIL || ''
    );

    expect(result).toBeNull();
  });
});
