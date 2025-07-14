// tests/routes/userRoutes.test.ts
import request from 'supertest';
import app from '../../main';
import jwt from 'jsonwebtoken';
import { create, findUserById } from '../../app/repositories/userRepository';
import { findIdByName } from '../../app/repositories/roleRepository';

// Mock dos repositórios
jest.mock('../../app/repositories/userRepository', () => ({
  create: jest.fn(),
  findUserById: jest.fn()
}));

jest.mock('../../app/repositories/roleRepository', () => ({
  findIdByName: jest.fn()
}));

const FAKE_TOKEN = jwt.sign(
  { id: 'user1' },
  process.env.JWT_SECRET || 'secret'
);

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
      expect(create).toHaveBeenCalled();
      expect(findIdByName).toHaveBeenCalledWith('teacher');
    });
  });

  describe('GET /users/:id (autenticado)', () => {
    it('deve falhar se não enviar token', async () => {
      const res = await request(app).get('/users/123');
      expect(res.status).toBe(401);
    });

    it('deve permitir acesso com token válido (mocked)', async () => {
      (findUserById as jest.Mock).mockResolvedValueOnce({
        id: '123',
        name: 'teste',
        email: 'teste@email.com'
      });

      const res = await request(app)
        .get('/users/123')
        .set('Authorization', `Bearer ${FAKE_TOKEN}`);

      expect(res.status).toBe(200);
      expect(res.body.details.user).toHaveProperty('email');
    });
  });
});
