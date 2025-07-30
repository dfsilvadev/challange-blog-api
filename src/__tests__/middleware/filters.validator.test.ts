import { NextFunction, Request, Response } from 'express';
import { validatePostFilters } from '../../app/middlewares/post/filtersValidator';

describe('validatePostFilters', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = { query: {} };
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    res = { status: statusMock };
    next = jest.fn();
  });

  it('should call next if all filters are valid or absent', () => {
    req.query = {};
    validatePostFilters(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if userId is not a valid UUID', () => {
    req.query = { userId: 'invalid-uuid' };
    validatePostFilters(req as Request, res as Response, next as NextFunction);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_USER_ID'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if userId is a valid UUID', () => {
    req.query = { userId: '4536040b-22c5-4c38-a881-5966bf5b6cc3' };
    validatePostFilters(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if createdAtStart is invalid', () => {
    req.query = { createdAtStart: 'invalid-date' };
    validatePostFilters(req as Request, res as Response, next as NextFunction);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_CREATED_AT_START'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if createdAtEnd is invalid', () => {
    req.query = { createdAtEnd: 'invalid-date' };
    validatePostFilters(req as Request, res as Response, next as NextFunction);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_CREATED_AT_END'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if isActive is invalid', () => {
    req.query = { isActive: 'not-boolean' };
    validatePostFilters(req as Request, res as Response, next as NextFunction);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_IS_ACTIVE'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if isActive is "true" or "false" as string', () => {
    req.query = { isActive: 'true' };
    validatePostFilters(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();

    req.query = { isActive: 'false' };
    validatePostFilters(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
  });

  it('should call next if isActive is boolean (simulated as string)', () => {
    req.query = { isActive: 'true' };
    validatePostFilters(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();

    req.query = { isActive: 'false' };
    validatePostFilters(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
  });
});
