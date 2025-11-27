import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as userController from '../../app/controllers/userController';
import * as roleRepository from '../../app/repositories/roleRepository';
import * as userRepository from '../../app/repositories/userRepository';

jest.mock('bcryptjs');
jest.mock('../../app/repositories/roleRepository');
jest.mock('../../app/repositories/userRepository');

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = { body: {}, params: {} };
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }) as any);
    res = { status: statusMock };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const fakeRoleId = uuidv4();
      const fakePasswordHash = 'hashed-password';
      const fakeUser = {
        id: uuidv4(),
        name: 'John',
        email: 'john@example.com'
      };

      req.body = {
        name: 'John',
        email: 'john@example.com',
        phone: '123456789',
        password: 'secret',
        roleName: 'teacher'
      };

      (roleRepository.findIdByName as jest.Mock).mockResolvedValue(fakeRoleId);
      (bcrypt.hash as jest.Mock).mockResolvedValue(fakePasswordHash);
      (userRepository.create as jest.Mock).mockResolvedValue(fakeUser);

      await userController.create(req as Request, res as Response, next);

      expect(roleRepository.findIdByName).toHaveBeenCalledWith('teacher');
      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@example.com',
        phone: '123456789',
        passwordHash: fakePasswordHash,
        roleId: fakeRoleId
      });

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'OK',
        details: fakeUser
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 500 if repository throws an error', async () => {
      const errorMessage = 'Unexpected error';
      req.body = {
        name: 'John',
        email: 'john@example.com',
        phone: '123',
        password: 'secret'
      };
      (roleRepository.findIdByName as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await userController.create(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: errorMessage
      });
    });
  });

  describe('findOne', () => {
    it('should return user if found', async () => {
      const fakeUserId = uuidv4();
      const fakeUser = { id: fakeUserId, name: 'John' };
      req.params = { id: fakeUserId };
      (userRepository.findById as jest.Mock).mockResolvedValue(fakeUser);

      await userController.findOne(req as Request, res as Response, next);

      expect(userRepository.findById).toHaveBeenCalledWith(fakeUserId);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'OK',
        details: fakeUser
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return USER_NOT_FOUND if user does not exist', async () => {
      const fakeUserId = uuidv4();
      req.params = { id: fakeUserId };
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await userController.findOne(req as Request, res as Response, next);

      expect(userRepository.findById).toHaveBeenCalledWith(fakeUserId);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        details: 'NOT_FOUND_USER',
        error: true
      });
    });

    it('should return 500 if repository throws an error', async () => {
      const fakeUserId = uuidv4();
      const errorMessage = 'Unexpected error';
      req.params = { id: fakeUserId };
      (userRepository.findById as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await userController.findOne(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: errorMessage
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
