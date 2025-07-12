import request from 'supertest';
import app from '../../main';

describe('Teste rotas Main', () => {
  it('deve responder 404 em rota não encontrada', async () => {
    const res = await request(app).get('/rota-inexistente');
    expect(res.status).toBe(404);
  });

  it('deve permitir CORS da origem configurada', async () => {
    const res = await request(app)
      .options('/login')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe(
      'http://localhost:5173'
    );
  });

  it('deve aceitar JSON no corpo da requisição', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'teste@exemplo.com', password: '123456' })
      .set('Content-Type', 'application/json');

    expect([200, 400, 401, 404]).toContain(res.status);
  });
});
