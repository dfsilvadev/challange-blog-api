import {
  findUserByEmailOrName,
  findUserById
} from '../../app/repositories/userRepository';
import { v4 as uuidv4 } from 'uuid';

// Mocka o módulo completo de userRepository, roleRepository e bcryptjs
jest.mock('../../app/repositories/roleRepository');
jest.mock('../../app/repositories/userRepository');
jest.mock('bcryptjs');

// Mocka o módulo de banco de dados, especificamente a função query
jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

describe('findUserByEmailOrName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar um usuário quando encontrado por e-mail ou nome', async () => {
    const idFake = uuidv4();
    const mockUser = {
      id: idFake,
      name: 'teste',
      email: 'teste@email.com',
      phone: '11987654321',
      password_hash: 'teste123'
    };

    (findUserByEmailOrName as jest.Mock).mockResolvedValue(mockUser);

    const result = await findUserByEmailOrName('teste@email.com');
    expect(result).toEqual(mockUser);
    expect(findUserByEmailOrName).toHaveBeenCalledWith('teste@email.com');
  });

  it('deve retornar null quando nenhum usuário é encontrado', async () => {
    (findUserByEmailOrName as jest.Mock).mockResolvedValue(null);

    const result = await findUserByEmailOrName('teste@erro.com');

    expect(result).toBeNull();
    expect(findUserByEmailOrName).toHaveBeenCalledWith('teste@erro.com');
  });
});

describe('findUserById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const idFake = uuidv4();
  const roleFake = uuidv4();

  it('deve retornar um usuário quando encontrado por id', async () => {
    const mockUser = {
      id: idFake,
      email: 'teste@email.com',
      name: 'teste',
      phone: '11912345678',
      roleId: roleFake
    };

    (findUserById as jest.Mock).mockResolvedValue(mockUser);

    const result = await findUserById(idFake);
    expect(result).toEqual(mockUser);
    expect(findUserById).toHaveBeenCalledWith(idFake);
  });

  it('deve retornar null quando nenhum usuário é encontrado', async () => {
    (findUserById as jest.Mock).mockResolvedValue(null);

    const result = await findUserById(uuidv4());
    expect(result).toBeNull();
    expect(findUserById).toHaveBeenCalledWith(expect.any(String));
  });
});
