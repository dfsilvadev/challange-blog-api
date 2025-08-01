import * as postController from '../../app/controllers/postController';
import * as postRepository from '../../app/repositories/postRepository';

import { mockPost } from '../../utils/mocks/mockPost';

jest.mock('../../app/repositories/postRepository');
jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

const mockFindById = postRepository.findById as jest.Mock;
const mockDeleteById = postRepository.deleteOne as jest.Mock;

describe('post Controller', () => {
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
    it('should call removeById and return status 200', async () => {
      mockFindById.mockResolvedValue(mockPost.id);
      mockDeleteById.mockResolvedValue(mockPost.id);

      await postController.removeById(req, res, jest.fn());

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        status: 'OK',
        details: 'POST_DELETED'
      });
    });

    it('should return 404 if findById fails', async () => {
      mockFindById.mockResolvedValue(null);
      mockDeleteById.mockResolvedValue(null);

      await postController.removeById(req, res, jest.fn());

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_POST'
      });
    });

    it('should return 500 if any error occurs, other than 404', async () => {
      mockFindById.mockImplementation(() => {
        throw new Error('SERVER_ERROR_INTERNAL');
      });

      await postController.removeById(req, res, jest.fn());

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        error: true,
        details: 'SERVER_ERROR_INTERNAL'
      });
    });
  });
});
