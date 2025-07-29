import request from 'supertest';
import express from 'express';
import router from '../../app/routes/router';
import { post1 } from '../../mocks/modulePosts';

jest.mock('../../app/controllers/postController', () => ({
  getPostById: jest.fn((req, res) =>
    res.status(200).json({ status: 'Ok', details: post1 })
  )
}));

jest.mock('../../app/middlewares/utils/validateUUID', () => ({
  validarUUID: jest.fn((req, res, next) => next())
}));

import { getPostById } from '../../app/controllers/postController';
import { validarUUID } from '../../app/middlewares/utils/validateUUID';

describe('GET /posts/:id rota', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(router);
    jest.clearAllMocks();
  });

  it('should call "validarUUID" and getPostById in the controller', async () => {
    const response = await request(app).get(`/posts/${post1.id}`);

    expect(validarUUID).toHaveBeenCalled();
    expect(getPostById).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'Ok', details: post1 });
  });

  it('should call "validarUUID" but an error should occur before it because its invalid', async () => {
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
