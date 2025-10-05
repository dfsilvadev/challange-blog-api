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

  describe('GET all categories', () => {
    it('should return all categories', async () => {
      (categoryRepository.findAll as jest.Mock).mockResolvedValueOnce(
        mockCategory
      );
      req.query = {};
      req.params = {};

      await categoryController.list(res as Response);

      expect(categoryRepository.findAll).toHaveBeenCalledWith();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'Ok',
        details: mockCategory
      });
    });

    it('should return 500 if repository throws an error', async () => {
      const errorMessage = 'Unexpected error';
      (categoryRepository.findAll as jest.Mock).mockRejectedValue(errorMessage);

      await categoryController.list(res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ details: errorMessage, error: true })
      );
    });
  });
});

describe('CategoryController - getExists', () => {
  interface MockRequest extends Partial<Request> {}
  let req: MockRequest;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = { params: {} };
    res = { status: statusMock };
    jest.clearAllMocks();
  });

  describe('GET category exists', () => {
    it('should return category if it exists', async () => {
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

    it('should return 500 if repository throws an error', async () => {
      const errorMessage = 'Unexpected error';
      (categoryRepository.findById as jest.Mock).mockRejectedValue(
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
  });
});
