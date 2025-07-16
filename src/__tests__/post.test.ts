import express from 'express';
import request from 'supertest';
import { query } from '../database/db';
import { createPost, updatePost } from '../app/controllers/postController'; // Importe updatePost

// Mock do módulo de banco de dados para evitar interações reais com o DB durante o teste
jest.mock('../database/db', () => ({
  query: jest.fn(),
}));

const app = express();
app.use(express.json());

// Rotas para testes
app.post('/posts', createPost);
app.put('/posts/:id', updatePost);

describe('POST /posts', () => {
  beforeEach(() => {
    // Limpar o mock antes de cada teste
    (query as jest.Mock).mockClear();
  });

  it('should create a new post successfully', async () => {
    const mockPost = {
      id: 'a-valid-uuid-1',
      title: 'Test Post',
      content: 'This is test content.',
      is_active: true,
      user_id: 'user-uuid-1',
      category_id: 'category-uuid-1',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    (query as jest.Mock).mockResolvedValue([mockPost]);

    const res = await request(app)
      .post('/posts')
      .send({
        title: 'Test Post',
        content: 'This is test content.',
        user_id: 'user-uuid-1',
        category_id: 'category-uuid-1',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockPost);
    expect(query).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO tb_post'),
      ['Test Post', 'This is test content.', true, 'user-uuid-1', 'category-uuid-1']
    );
  });

  it('should return 400 if title or content are missing when creating post', async () => {
    const res = await request(app)
      .post('/posts')
      .send({
        content: 'This is test content.',
        user_id: 'user-uuid-1',
        category_id: 'category-uuid-1',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual('todos os campos precisam estar preenchidos');
    expect(query).not.toHaveBeenCalled();
  });

  it('should return 500 if there is a database error when creating post', async () => {
    (query as jest.Mock).mockRejectedValue(new Error('Database error'));

    const res = await request(app)
      .post('/posts')
      .send({
        title: 'Test Post',
        content: 'This is test content.',
        user_id: 'user-uuid-1',
        category_id: 'category-uuid-1',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Erro na criação do post.' });
    expect(query).toHaveBeenCalledTimes(1);
  });
});

describe('PUT /posts/:id', () => {
  beforeEach(() => {
    (query as jest.Mock).mockClear();
  });

  it('should update an existing post successfully', async () => {
    const postId = 'existing-post-uuid';
    const updatedData = {
      title: 'Updated Title',
      content: 'Updated content.',
      is_active: false,
      category_id: 'new-category-uuid',
    };
    const mockUpdatedPost = {
      id: postId,
      ...updatedData,
      user_id: 'user-uuid-1',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z', // Assuming updated_at changes
    };

    (query as jest.Mock).mockResolvedValueOnce([mockUpdatedPost]); // For the update query

    const res = await request(app)
      .put(`/posts/${postId}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUpdatedPost);
    expect(query).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE tb_post'),
      [
        postId,
        updatedData.title,
        updatedData.content,
        updatedData.is_active,
        updatedData.category_id,
      ]
    );
  });

  it('should return 404 if the post to update does not exist', async () => {
    const postId = 'non-existent-uuid';
    const updatedData = {
      title: 'Updated Title',
    };

    (query as jest.Mock).mockResolvedValueOnce([]); // No post found

    const res = await request(app)
      .put(`/posts/${postId}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: 'Postagem não encontrada.' });
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if no data is provided for update', async () => {
    const postId = 'existing-post-uuid';
    const res = await request(app)
      .put(`/posts/${postId}`)
      .send({}); // Empty body

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: 'Nenhum dado fornecido para atualização.' });
    expect(query).not.toHaveBeenCalled();
  });

  it('should return 500 if there is a database error during update', async () => {
    const postId = 'existing-post-uuid';
    const updatedData = { title: 'Updated Title' };

    (query as jest.Mock).mockRejectedValue(new Error('Database error'));

    const res = await request(app)
      .put(`/posts/${postId}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Erro na atualização do post.' });
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('should update only the title', async () => {
    const postId = 'existing-post-uuid';
    const updatedData = { title: 'Updated Title Only' };
    const mockUpdatedPost = {
      id: postId,
      title: 'Updated Title Only',
      content: 'Original content.',
      is_active: true,
      user_id: 'user-uuid-1',
      category_id: 'category-uuid-1',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    };

    (query as jest.Mock).mockResolvedValueOnce([mockUpdatedPost]);

    const res = await request(app)
      .put(`/posts/${postId}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUpdatedPost);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE tb_post SET title = $2 WHERE id = $1'),
      [postId, updatedData.title]
    );
  });

  it('should update only the content and is_active', async () => {
    const postId = 'existing-post-uuid';
    const updatedData = { content: 'New content', is_active: false };
    const mockUpdatedPost = {
      id: postId,
      title: 'Original Title',
      content: 'New content',
      is_active: false,
      user_id: 'user-uuid-1',
      category_id: 'category-uuid-1',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    };

    (query as jest.Mock).mockResolvedValueOnce([mockUpdatedPost]);

    const res = await request(app)
      .put(`/posts/${postId}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUpdatedPost);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE tb_post SET content = $2, is_active = $3 WHERE id = $1'),
      [postId, updatedData.content, updatedData.is_active]
    );
  });
});
