import request from 'supertest';
import app from '../../main';

process.env.JWT_SECRET = 'mocked-secret';

jest.mock('../../app/repositories/userRepository', () => ({
  create: jest.fn(),
  findUserById: jest.fn()
}));

jest.mock('../../app/repositories/roleRepository', () => ({
  findIdByName: jest.fn()
}));

import { create } from '../../app/repositories/userRepository';
import { findIdByName } from '../../app/repositories/roleRepository';

describe('Rotas de usuário', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users (validação)', () => {
    it('deve falhar com email inválido', async () => {
      const res = await request(app).post('/users').send({
        email: 'invalido',
        phone: '11970683909',
        name: 'teste',
        password: 'Senha@123'
      });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Email inválido');
    });

    it('deve criar usuário com dados válidos (mocked)', async () => {
      (findIdByName as jest.Mock).mockResolvedValueOnce({ id: 'role123' });
      (create as jest.Mock).mockResolvedValueOnce({
        id: 'user123',
        name: 'teste',
        email: 'teste@email.com',
        phone: '11970683909',
        roleId: 'role123'
      });

      const res = await request(app).post('/users').send({
        email: 'teste@email.com',
        phone: '11970683909',
        name: 'teste',
        password: 'Senha@123'
      });

      expect(res.status).toBe(201);
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'teste',
          email: 'teste@email.com',
          phone: '11970683909',
          password_hash: expect.any(String),
          roleId: 'role123'
        })
      );
      expect(findIdByName).toHaveBeenCalledWith('teacher');
    });
  });
});
