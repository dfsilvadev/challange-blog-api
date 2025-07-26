import bcrypt from 'bcryptjs';

import { createUser } from '../../app/controllers/userController';

import { findIdByName } from '../../app/repositories/roleRepository';
import {
  create,
  findUserByEmailOrName
} from '../../app/repositories/userRepository';

import { mockUser, roleFake } from '../../utils/mocks/mockUser';
import crypto from 'crypto';

jest.mock('../../app/repositories/userRepository');
jest.mock('../../app/repositories/roleRepository');
jest.mock('bcryptjs');
jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

const mockFindIdByName = findIdByName as jest.Mock;
const mockCreate = create as jest.Mock;
const mockFindUserByEmailOrName = findUserByEmailOrName as jest.Mock;
const mockBcryptHash = bcrypt.hash as jest.Mock;

const generateRandomHash = (): string => {
  const randomString = crypto.randomBytes(10).toString('hex');
  return bcrypt.hashSync(randomString, 10);
};

describe('createUser controller', () => {
  const body = {
    name: 'teste',
    email: 'teste@email.com',
    phone: '11999999999',
    password: generateRandomHash()
  };
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as any;

  // Limpa todos os mocks antes de cada teste
  beforeEach(() => {
    mockFindIdByName.mockResolvedValue({ id: roleFake });
    mockBcryptHash.mockResolvedValue(body.password);
    mockFindUserByEmailOrName.mockResolvedValue(null);
    jest.clearAllMocks();
  });

  it('deve criar um usuário com dados válidos', async () => {
    mockCreate.mockResolvedValue(mockUser);

    const req = {
      body
    } as any;

    await createUser(req, res, jest.fn());

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      status: 'OK',
      details: {
        user: mockUser
      }
    });
  });

  it('deve retornar 500 em caso de erro', async () => {
    mockCreate.mockRejectedValue(new Error('Erro na criação'));

    const req = {
      body
    } as any;

    await createUser(req, res, jest.fn());

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: true,
      details: expect.any(Error)
    });
  });
});
