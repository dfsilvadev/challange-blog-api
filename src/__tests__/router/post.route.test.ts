import request from 'supertest';
import express from 'express';
import router from '../../app/routes/router';
import { post1 } from '../../mocks/modulePosts';

jest.mock('../../app/controllers/postController', () => ({
  getPostById: jest.fn((req, res) =>
    res.status(200).json({ status: 'Ok', details: post1 })
  )
}));

jest.mock('../../app/middlewares/validarUUID', () => ({
  validarUUID: jest.fn((req, res, next) => next())
}));

import { getPostById } from '../../app/controllers/postController';
import { validarUUID } from '../../app/middlewares/validarUUID';

describe('GET /posts/:id rota', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(router);
    jest.clearAllMocks();
  });

  it('deve chamar validarUUID e o getPostById do controller', async () => {
    const response = await request(app).get(`/posts/${post1.id}`);

    expect(validarUUID).toHaveBeenCalled();
    expect(getPostById).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'Ok', details: post1 });
  });

  it('deve chamar validarUUID mas dará erro antes por ser inválido', async () => {
    (validarUUID as jest.Mock).mockImplementation((req, res, _next) => {
      res.status(400).json({ error: true, details: 'INVALID_UUID' });
    });

    const response = await request(app).get('/posts/12');

    expect(validarUUID).toHaveBeenCalled();
    expect(getPostById).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: true, details: 'INVALID_UUID' });
  });
});
