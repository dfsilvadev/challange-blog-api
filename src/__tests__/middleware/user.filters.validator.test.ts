import { NextFunction, Request, Response } from 'express';
import { validateUserFilters } from '../../app/middlewares/user/userFiltersValidator';

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
    validateUserFilters(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if roleName is not valid', () => {
    req.query = { roleName: 'coordinator' };
    validateUserFilters(req as Request, res as Response, next as NextFunction);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_ROLE_NAME'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if roleName is valid', () => {
    req.query = { roleName: 'teacher' };
    validateUserFilters(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if email is invalid', () => {
    req.query = { email: 'meuteste.com' };
    validateUserFilters(req as Request, res as Response, next as NextFunction);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_EMAIL_ADDRESS'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if email is valid', () => {
    req.query = { email: 'meuteste@gmail.com' };
    validateUserFilters(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if name is invalid', () => {
    req.query = { name: '1234' };
    validateUserFilters(req as Request, res as Response, next as NextFunction);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_NAME'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if name is valid', () => {
    req.query = { name: 'professor X' };
    validateUserFilters(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
  });
});
