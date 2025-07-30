import { Request, Response } from 'express';

import { list, listByUserId } from '../../app/controllers/postController';

import { count, findAll } from '../../app/repositories/postRepository';

import { mockPagination, mockPosts } from '../../utils/mocks/mockPost';

jest.mock('../../app/repositories/postRepository', () => ({
  findAll: jest.fn(),
  count: jest.fn()
}));

describe('postController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = { query: {}, params: {} };
    res = { status: statusMock };
    jest.clearAllMocks();
  });

  it('should return paginated posts with default values', async () => {
    (findAll as jest.Mock).mockResolvedValueOnce(mockPosts);
    (count as jest.Mock).mockResolvedValueOnce(mockPosts.length);
    req.query = {};
    req.params = {};

    await list(req as Request, res as Response);

    expect(findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      orderBy: 'ASC',
      userId: undefined
    });
    expect(count).toHaveBeenCalledWith({ userId: undefined });
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'Ok',
      details: mockPosts,
      pagination: expect.objectContaining(mockPagination)
    });
  });

  it('should use custom page, limit and orderBy DESC', async () => {
    (findAll as jest.Mock).mockResolvedValueOnce([]);
    (count as jest.Mock).mockResolvedValueOnce(mockPosts.length);
    req.query = { page: '2', limit: '2', orderBy: 'DESC' };
    req.params = {};

    await list(req as Request, res as Response);

    expect(findAll).toHaveBeenCalledWith({
      page: 2,
      limit: 2,
      orderBy: 'DESC',
      userId: undefined
    });
    expect(count).toHaveBeenCalledWith({ userId: undefined });
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'Ok',
        details: [],
        pagination: expect.objectContaining({
          total: mockPosts.length,
          totalPages: 2,
          registersPerPage: 2,
          currentPage: 2,
          hasNextPage: false,
          hasPreviousPage: true,
          nextPage: 0,
          previousPage: 1,
          firstPage: 1,
          lastPage: 0
        })
      })
    );
  });

  it('should fallback to ASC if orderBy is invalid', async () => {
    (findAll as jest.Mock).mockResolvedValueOnce(mockPosts);
    (count as jest.Mock).mockResolvedValueOnce(mockPosts.length);
    req.query = { orderBy: 'INVALID' };
    req.params = {};

    await list(req as Request, res as Response);

    expect(findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      orderBy: 'ASC',
      userId: undefined
    });
    expect(count).toHaveBeenCalledWith({ userId: undefined });
  });

  it('should handle userId from params', async () => {
    const userId = '4536040b-22c5-4c38-a881-5966bf5b6cc3';
    const mockPostByUserId = mockPosts.filter(
      (post) => post.user_id === userId
    );
    (findAll as jest.Mock).mockResolvedValueOnce(mockPostByUserId);
    (count as jest.Mock).mockResolvedValueOnce(mockPostByUserId.length);
    req.query = {};
    req.params = { userId };

    await listByUserId(req as Request, res as Response);

    expect(findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      orderBy: 'ASC',
      userId
    });
    expect(count).toHaveBeenCalledWith({ userId });
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'Ok',
        details: mockPostByUserId,
        pagination: expect.objectContaining({
          total: mockPostByUserId.length,
          totalPages: 1,
          registersPerPage: 10,
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          nextPage: 0,
          previousPage: 0,
          firstPage: 0,
          lastPage: 0
        })
      })
    );
  });

  it('should handle pagination with only one page', async () => {
    (findAll as jest.Mock).mockResolvedValueOnce(mockPosts);
    (count as jest.Mock).mockResolvedValueOnce(mockPosts.length);
    req.query = { page: '1', limit: '10' };
    req.params = {};

    await list(req as Request, res as Response);

    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pagination: expect.objectContaining({
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          nextPage: 0,
          previousPage: 0,
          firstPage: 0,
          lastPage: 0
        })
      })
    );
  });
});
