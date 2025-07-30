import {
  removeById,
  getById,
  created
} from '../../app/controllers/postController';

import {
  deleteById,
  findById,
  create
} from '../../app/repositories/postRepository';
import { findUserById } from '../../app/repositories/userRepository';
import * as categories from '../../app/repositories/categoryRepository';

import { mockPost } from '../../utils/mocks/mockPost';

jest.mock('../../app/repositories/categoryRepository');
jest.mock('../../app/repositories/postRepository');
jest.mock('../../app/repositories/userRepository');
jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

const mockFindById = findById as jest.Mock;
const mockDeleteById = deleteById as jest.Mock;
const mockCreate = create as jest.Mock;
const mockFindUserById = findUserById as jest.Mock;
const mockFindCategoryById = categories.findById as jest.Mock;

describe('GET /post/:id', () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));

  const req = {
    params: { id: mockPost.id }
  } as any;
  const res = { status } as any;

  beforeEach(() => {
    mockFindById.mockResolvedValue({ id: mockPost.id });
    jest.clearAllMocks();
  });

  it('deve retornar o POST por ID', async () => {
    await getById(req, res, jest.fn());

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      status: 'Ok',
      details: { id: mockPost.id }
    });
  });

  it('deve retornar 404 se o ID do POST não existir', async () => {
    mockFindById.mockResolvedValue(null);

    await getById(req, res, jest.fn());

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      error: true,
      details: 'NOT_FOUND_POST'
    });
  });
});

describe('DELETE /post/:id', () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));

  const req = {
    params: { id: mockPost.id }
  } as any;
  const res = { status } as any;

  beforeEach(() => {
    mockFindById.mockResolvedValue({ id: mockPost.id });
    mockDeleteById.mockResolvedValue({ id: mockPost.id });
    jest.clearAllMocks();
  });

  describe('removeById success', () => {
    it('deve chamar removeById e retornar status 200', async () => {
      mockFindById.mockResolvedValue(mockPost.id);
      mockDeleteById.mockResolvedValue(mockPost.id);

      await removeById(req, res, jest.fn());

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        status: 'OK',
        details: { post: mockPost.id }
      });
    });

    it('deve retornar 404 se o ID do POST não existir', async () => {
      mockFindById.mockResolvedValue(null);
      mockDeleteById.mockResolvedValue(null);

      await removeById(req, res, jest.fn());

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_POST'
      });
    });

    it('deve retornar 500 se voltar qualquer erro, fora o 404', async () => {
      mockFindById.mockImplementation(() => {
        throw new Error('SERVER_ERROR_INTERNAL');
      });

      await removeById(req, res, jest.fn());

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        error: true,
        details: new Error('SERVER_ERROR_INTERNAL')
      });
    });
  });
});

describe('POST /post/', () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));

  let req = { body: mockPost } as any;
  const res = { status } as any;

  beforeEach(() => {
    req = { body: mockPost } as any;
    mockCreate.mockResolvedValue(mockPost);
    mockFindCategoryById.mockResolvedValue(mockPost.category_id);
    mockFindUserById.mockResolvedValue(mockPost.user_id);
    jest.clearAllMocks();
  });

  it('deve criar um novo post com sucesso', async () => {
    mockCreate.mockResolvedValue(mockPost);
    await created(req, res, jest.fn());

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      status: 'OK',
      details: mockPost
    });
  });

  it('deve retornar 500 em caso de erro', async () => {
    mockCreate.mockRejectedValue(new Error('Erro na criação'));

    await created(req, res, jest.fn());

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: true,
      details: expect.any(Error)
    });
  });
});
