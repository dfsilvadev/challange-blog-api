import {
  create,
  findUserByEmailOrName
} from '../../app/repositories/userRepository';
import { findIdByName } from '../../app/repositories/roleRepository';
jest.mock('../../app/repositories/userRepository');
import { v4 as uuidv4 } from 'uuid';
import { createUser } from '../../app/controllers/userController';
import bcrypt from 'bcryptjs';

// Mocka o módulo completo de userRepository, roleRepository e bcryptjs
jest.mock('../../app/repositories/roleRepository');
jest.mock('../../app/repositories/userRepository');
jest.mock('bcryptjs');

// Mocka o módulo de banco de dados, especificamente a função query
jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

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

    const userExists = await findUserByEmailOrName('teste');
    if (userExists) {
      return res.status(409).json({
        error: true,
        message: 'Usuário já cadastrado, favor verificar os dados informados.'
      });
    }

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
