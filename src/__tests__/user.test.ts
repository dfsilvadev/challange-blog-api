import {
  findUserByEmailOrName,
  findUserById,
  create
} from '../app/repositories/userRepository';
import { findIdByName } from '../app/repositories/roleRepository';
import { v4 as uuidv4 } from 'uuid';
import { createUser } from '../app/controllers/userController';
import bcrypt from 'bcryptjs';

// Mocka o módulo completo de userRepository, roleRepository e bcryptjs
jest.mock('../app/repositories/roleRepository');
jest.mock('../app/repositories/userRepository');
jest.mock('bcryptjs');

// Mocka o módulo de banco de dados, especificamente a função query
jest.mock('../database/db', () => ({
  query: jest.fn()
}));

// Testes de Endpoint
describe('createUser controller', () => {
  // Limpa todos os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um usuário com sucesso', async () => {
    const roleFake = uuidv4();
    const idFake = uuidv4();

    // Criar mocks
    (findIdByName as jest.Mock).mockResolvedValue({ id: roleFake });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (create as jest.Mock).mockResolvedValue({
      id: idFake,
      name: 'teste',
      email: 'teste@email.com',
      phone: '11999999999',
      password_hash: 'hashedPassword',
      roleId: roleFake
    });
    // Objeto de requisição simulado
    const req = {
      body: {
        name: 'teste',
        email: 'teste@email.com',
        phone: '11999999999',
        password: 'hashedPassword'
      }
    } as any;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as any;

    await createUser(req, res, jest.fn());

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      status: 'OK',
      details: {
        user: {
          id: idFake,
          name: 'teste',
          email: 'teste@email.com',
          phone: '11999999999',
          password_hash: 'hashedPassword',
          roleId: roleFake
        }
      }
    });
  });

  it('deve retornar 500 em caso de erro', async () => {
    (findIdByName as jest.Mock).mockResolvedValue({ id: 'role123' });
    (create as jest.Mock).mockRejectedValue(new Error('Erro na criação'));

    const req = {
      body: {
        name: 'testeErro',
        email: 'teste@erro.com',
        phone: '123',
        password: 'qualquer'
      }
    } as any;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as any;

    await createUser(req, res, jest.fn());

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: true,
      details: expect.any(Error)
    });
  });
});

// Testes de integração com banco
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

    const id = process.env.USER_ID || uuidv4();

    (findUserById as jest.Mock).mockResolvedValue(mockUser);

    const result = await findUserById(id);
    expect(result).toEqual(mockUser);
    expect(findUserById).toHaveBeenCalledWith(id);
  });

  it('deve retornar null quando nenhum usuário é encontrado', async () => {
    (findUserById as jest.Mock).mockResolvedValue(null);

    const result = await findUserById(uuidv4());
    expect(result).toBeNull();
    expect(findUserById).toHaveBeenCalledWith(expect.any(String));
  });
});
