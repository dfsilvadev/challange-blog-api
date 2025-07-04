import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

app.post('/user', (req, res) => {
  res.status(200).send('User mock created successfully!');
});

describe('POST /user', () => {
  it('should create a user', async () => {
    const res = await request(app).post('/user').send({
      username: 'johndoe',
      email: 'johndoe@example.com'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('User mock created successfully!');
  });
});
