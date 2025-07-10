// tests/authController.test.ts
import { login } from '../app/controllers/authenticationController';
import * as userRepo from '../app/repositories/userRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mocka as dependências
jest.mock('../app/repositories/userRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('login controller', () => {
  const mockReq = {
    body: {
      username: 'professor',
      password: 'Test123*'
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
    // Mocka retorno do repositório
    (userRepo.findUserByEmailOrName as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'professor',
      password_hash: 'hashed_password'
    });

    // Mocka bcrypt e jwt
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
      id: '1',
      email: 'test@example.com',
      name: 'professor',
      password_hash: 'hashed_password'
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
