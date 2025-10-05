import { Request, Response } from 'express';

import * as categoryController from '../../app/controllers/categoryController';

import * as categoryRepository from '../../app/repositories/categoryRepository';

import { mockCategory } from '../../utils/mocks/mockCategory';

jest.mock('../../app/repositories/categoryRepository', () => ({
  findAll: jest.fn()
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
