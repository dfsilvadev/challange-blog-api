import { Request, Response } from 'express';
import * as categoryController from '../../app/controllers/categoryController';
import * as categoryRepository from '../../app/repositories/categoryRepository';
import { mockCategory } from '../../utils/mocks/mockCategory';

jest.mock('../../app/repositories/categoryRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn()
}));

describe('CategoryController', () => {
  interface MockRequest extends Partial<Request> {}
  let req: MockRequest;
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

  describe('GET all categories (list)', () => {
    it('should return all categories successfully', async () => {
      (categoryRepository.findAll as jest.Mock).mockResolvedValueOnce(
        mockCategory
      );

      await categoryController.list({} as Request, res as Response);

      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'Ok',
        details: mockCategory
      });
    });

    it('should handle repository error (string)', async () => {
      const errorMessage = 'Unexpected error';
      (categoryRepository.findAll as jest.Mock).mockRejectedValueOnce(
        errorMessage
      );

      await categoryController.list({} as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: errorMessage
      });
    });

    it('should handle repository error (Error object)', async () => {
      const error = new Error('Error object occurred');
      (categoryRepository.findAll as jest.Mock).mockRejectedValueOnce(error);

      await categoryController.list({} as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'Error object occurred'
      });
    });
  });

  describe('GET category exists (exists)', () => {
    beforeEach(() => {
      req = { params: {} };
      res = { status: statusMock };
      jest.clearAllMocks();
    });

    it('should return category when it exists', async () => {
      (categoryRepository.findById as jest.Mock).mockResolvedValueOnce(
        mockCategory[0]
      );

      req.params = { id: mockCategory[0].id };

      await categoryController.exists(req as Request, res as Response);

      expect(categoryRepository.findById).toHaveBeenCalledWith(
        mockCategory[0].id
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'Ok',
        details: mockCategory[0]
      });
    });

    it('should handle repository error (string)', async () => {
      const errorMessage = 'Unexpected error';
      (categoryRepository.findById as jest.Mock).mockRejectedValueOnce(
        errorMessage
      );

      req.params = { id: 'category-id-123' };

      await categoryController.exists(req as Request, res as Response);

      expect(categoryRepository.findById).toHaveBeenCalledWith(
        'category-id-123'
      );
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: errorMessage
      });
    });

    it('should handle repository error (Error object)', async () => {
      const error = new Error('Something went wrong');
      (categoryRepository.findById as jest.Mock).mockRejectedValueOnce(error);

      req.params = { id: 'category-id-456' };

      await categoryController.exists(req as Request, res as Response);

      expect(categoryRepository.findById).toHaveBeenCalledWith(
        'category-id-456'
      );
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'Something went wrong'
      });
    });
  });
});
