import { removeById } from '../../app/controllers/postController';
import { mockPost } from '../../utils/mocks/mockPost';

jest.mock('../../app/controllers/postController');

const mockRemoveById = removeById as jest.Mock;

describe('postController', () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const req = {
    params: { id: mockPost.id }
  } as any;

  const res = { status } as any;
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('removeById success', () => {
    it('deve chamar removeById e retornar status 200', async () => {
      mockRemoveById.mockImplementation(async (_req, res, _next) => {
        res.status(200).json({ status: 'OK', details: { post: mockPost } });
      });

      await mockRemoveById(req, res, next);

      expect(mockRemoveById).toHaveBeenCalledWith(req, res, next);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        status: 'OK',
        details: { post: mockPost }
      });
    });
  });

  describe('removeById error (post não encontrado)', () => {
    it('deve chamar removeById e retornar status 404', async () => {
      mockRemoveById.mockImplementation(async (_req, res, _next) => {
        res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
      });

      await mockRemoveById(req, res, next);

      expect(mockRemoveById).toHaveBeenCalledWith(req, res, next);
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_POST'
      });
    });
  });
});
