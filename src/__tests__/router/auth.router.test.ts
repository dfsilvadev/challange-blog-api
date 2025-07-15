import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { login } from '../../app/controllers/authenticationController';
import * as userRepo from '../../app/repositories/userRepository';

jest.mock('../../app/repositories/userRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

jest.mock('pg', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(undefined),
      query: jest.fn().mockResolvedValue({ rows: [] })
    })),
    types: {
      setTypeParser: jest.fn()
    },
    QueryResultRow: jest.fn()
  };
});

describe('login controller', () => {
  const idFake = uuidv4();

  const mockReq = {
    body: {
      username: 'teste',
      password: '11912345678'
    }
  } as any;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 200 e token se login for bem-sucedido', async () => {
    (userRepo.findUserByEmailOrName as jest.Mock).mockResolvedValue({
      id: idFake,
      email: 'teste@email.com',
      name: 'teste',
      password_hash: '11912345678'
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('fake-token');

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'OK',
      details: { token: 'fake-token' }
    });
  });

  it('deve retornar 401 se o usuário não existir', async () => {
    (userRepo.findUserByEmailOrName as jest.Mock).mockResolvedValue(null);

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_USER'
    });
  });

  it('deve retornar 401 se a senha for inválida', async () => {
    (userRepo.findUserByEmailOrName as jest.Mock).mockResolvedValue({
      id: idFake,
      email: 'teste@email.com',
      name: 'teste',
      password_hash: '11912345678'
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: true,
      details: 'ENCRYPTION_ERROR'
    });
  });

  it('deve retornar 500 em erro inesperado', async () => {
    (userRepo.findUserByEmailOrName as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: true,
      details: 'SERVER_ERROR_INTERNAL'
    });
  });
});
