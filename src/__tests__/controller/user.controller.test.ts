import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as userController from '../../app/controllers/userController';
import * as roleRepository from '../../app/repositories/roleRepository';
import * as userRepository from '../../app/repositories/userRepository';

import { mockPagination, mockList } from '../../utils/mocks/mockUser';

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

  describe('GET all Users', () => {
    it('should return paginated Users with default values', async () => {
      (userRepository.findAll as jest.Mock).mockResolvedValueOnce(mockList);
      (userRepository.count as jest.Mock).mockResolvedValueOnce(
        mockList.length
      );
      req.query = {};
      req.params = {};

      await userController.listAll(req as Request, res as Response);

      expect(userRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderBy: 'ASC'
      });
      expect(userRepository.count).toHaveBeenCalledWith();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'Ok',
        details: mockList,
        pagination: expect.objectContaining(mockPagination)
      });
    });

    it('should return paginated Users with custom page, limit and orderBy DESC', async () => {
      (userRepository.findAll as jest.Mock).mockResolvedValueOnce([]);
      (userRepository.count as jest.Mock).mockResolvedValueOnce(
        mockList.length
      );
      req.query = { page: '2', limit: '2', orderBy: 'DESC' };
      req.params = {};

      await userController.listAll(req as Request, res as Response);

      expect(userRepository.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 2,
        orderBy: 'DESC'
      });
      expect(userRepository.count).toHaveBeenCalledWith();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'Ok',
          details: [],
          pagination: expect.objectContaining({
            total: mockList.length,
            totalPages: 1,
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

    it('should fallback to ASC order if orderBy is invalid', async () => {
      (userRepository.findAll as jest.Mock).mockResolvedValueOnce(mockList);
      (userRepository.count as jest.Mock).mockResolvedValueOnce(
        mockList.length
      );
      req.query = { orderBy: 'INVALID' };
      req.params = {};

      await userController.listAll(req as Request, res as Response);

      expect(userRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderBy: 'ASC'
      });
      expect(userRepository.count).toHaveBeenCalledWith();
    });

    it('should return correct pagination when only one page', async () => {
      (userRepository.findAll as jest.Mock).mockResolvedValueOnce(mockList);
      (userRepository.count as jest.Mock).mockResolvedValueOnce(
        mockList.length
      );
      req.query = { page: '1', limit: '10' };
      req.params = {};

      await userController.listAll(req as Request, res as Response);

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

  describe('findByFilter', () => {
    it('should return paginated users', async () => {
      (userRepository.findByFilter as jest.Mock).mockResolvedValueOnce(
        mockList
      );

      req.query = {};
      req.params = {};

      await userController.findByFilter(req as Request, res as Response);

      expect(userRepository.findByFilter).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderBy: 'DESC'
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'Ok',
        details: mockList,
        pagination: expect.objectContaining(mockPagination)
      });
    });

    it('should return paginated users with custom page, limit and orderBy DESC', async () => {
      (userRepository.findByFilter as jest.Mock).mockResolvedValueOnce([]);
      req.query = { page: '2', limit: '2', orderBy: 'DESC' };
      req.params = {};

      await userController.findByFilter(req as Request, res as Response);

      expect(userRepository.findByFilter).toHaveBeenCalledWith({
        page: 2,
        limit: 2,
        orderBy: 'DESC'
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'Ok',
          details: [],
          pagination: expect.objectContaining({
            total: 0,
            totalPages: 0,
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

    it('should return users filtered by criteria', async () => {
      const email = 'teste@email.com';
      const mockUsersByFilter = mockList.filter((user) => user.email === email);

      (userRepository.findByFilter as jest.Mock).mockResolvedValueOnce(
        mockUsersByFilter
      );

      req.query = {
        page: '2',
        limit: '2',
        orderBy: 'DESC',
        email: email
      };
      req.params = {};

      await userController.findByFilter(req as Request, res as Response);
      expect(userRepository.findByFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          email: email,
          limit: 2,
          orderBy: 'DESC',
          page: 2
        })
      );
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'Ok',
          details: mockUsersByFilter,
          pagination: expect.objectContaining({
            total: 1,
            totalPages: 1,
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

    it('should return 500 if bcrypt.hash fails', async () => {
      const fakeRoleId = uuidv4();
      req.body = {
        name: 'John',
        email: 'john@example.com',
        phone: '123456789',
        password: 'secret',
        roleName: 'teacher'
      };

      (roleRepository.findIdByName as jest.Mock).mockResolvedValue(fakeRoleId);
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('hash error'));

      await userController.create(req as Request, res as Response, next);

      expect(roleRepository.findIdByName).toHaveBeenCalledWith('teacher');
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'hash error'
      });
    });

    it('should return 500 if userRepository.create throws an error', async () => {
      const fakeRoleId = uuidv4();
      req.body = {
        name: 'John',
        email: 'john@example.com',
        phone: '123456789',
        password: 'secret',
        roleName: 'teacher'
      };

      (roleRepository.findIdByName as jest.Mock).mockResolvedValue(fakeRoleId);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (userRepository.create as jest.Mock).mockRejectedValueOnce(
        new Error('create error')
      );

      await userController.create(req as Request, res as Response, next);

      expect(roleRepository.findIdByName).toHaveBeenCalledWith('teacher');
      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'create error'
      });
    });

    it('should call create with null roleId when roleRepository returns null', async () => {
      req.body = {
        name: 'John',
        email: 'john@example.com',
        phone: '123456789',
        password: 'secret',
        roleName: 'teacher'
      };

      (roleRepository.findIdByName as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      const fakeUser = {
        id: uuidv4(),
        name: 'John',
        email: 'john@example.com'
      };
      (userRepository.create as jest.Mock).mockResolvedValueOnce(fakeUser);

      await userController.create(req as Request, res as Response, next);

      expect(roleRepository.findIdByName).toHaveBeenCalledWith('teacher');
      expect(userRepository.create).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@example.com',
        phone: '123456789',
        passwordHash: 'hashed-password',
        roleId: null
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'OK',
        details: fakeUser
      });
    });
  });

  describe('updateById', () => {
    it('should return 404 if user does not exist', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValueOnce(null);
      req.params = { id: 'user-id' };
      req.body = {};
      await userController.updateById(req as any, res as any, next);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_USER'
      });
    });

    it('should return 404 if roles does not exist', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValueOnce({
        id: 'user-id'
      });
      (roleRepository.findIdByName as jest.Mock).mockResolvedValueOnce(null);
      req.params = { id: 'user-id' };
      req.body = { roleName: 'roleName' };
      await userController.updateById(req as any, res as any, next);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_ROLE'
      });
    });

    it('should return 500 on unexpected error', async () => {
      (userRepository.findById as jest.Mock).mockRejectedValueOnce(
        new Error('DB error')
      );
      req.params = { id: 'user-id' };
      req.body = {};
      await userController.updateById(req as any, res as any, next);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'DB error'
      });
    });

    it('should update user and return updated object when fields provided', async () => {
      const id = 'user-id-123';
      const existingUser = { id };
      const updatedUser = {
        id,
        name: 'New Name',
        email: 'new@example.com',
        phone: '111'
      };

      (userRepository.findById as jest.Mock).mockResolvedValueOnce(
        existingUser
      );
      (userRepository.update as jest.Mock).mockResolvedValueOnce(updatedUser);

      req.params = { id };
      req.body = {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone
      };

      await userController.updateById(req as any, res as any, next);

      expect(userRepository.findById).toHaveBeenCalledWith(id);
      expect(userRepository.update).toHaveBeenCalledWith(id, {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'OK',
        details: updatedUser
      });
    });

    it('should resolve roleName to roleId and update user with roleId', async () => {
      const id = 'user-id-456';
      const existingUser = { id };
      const roleId = 'role-999';
      const updatedUser = { id, role_id: roleId };

      (userRepository.findById as jest.Mock).mockResolvedValueOnce(
        existingUser
      );
      (roleRepository.findIdByName as jest.Mock).mockResolvedValueOnce(roleId);
      (userRepository.update as jest.Mock).mockResolvedValueOnce(updatedUser);

      req.params = { id };
      req.body = { roleName: 'teacher' };

      await userController.updateById(req as any, res as any, next);

      expect(roleRepository.findIdByName).toHaveBeenCalledWith('teacher');
      expect(userRepository.update).toHaveBeenCalledWith(id, { roleId });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'OK',
        details: updatedUser
      });
    });
  });

  describe('DELETE /user:id', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete a user successfully if user is authenticated and is the creator', async () => {
      const id = 'user-id-123';
      (userRepository.findById as jest.Mock).mockResolvedValueOnce({
        id
      });
      (userRepository.deleteOne as jest.Mock).mockResolvedValueOnce({});
      req.params = { id };

      await userController.removeById(req as Request, res as Response, next);

      expect(userRepository.findById).toHaveBeenCalledWith(id);
      expect(userRepository.deleteOne).toHaveBeenCalledWith(id);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'OK',
        details: 'USER_DELETED'
      });
    });

    it('should return 404 if user does not exist', async () => {
      const id = 'not-found-id';
      (userRepository.findById as jest.Mock).mockResolvedValueOnce(null);
      req.params = { id };

      await userController.removeById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_USER'
      });
    });
  });

  describe('removeById', () => {
    it('should return 500 on unexpected error', async () => {
      (userRepository.findById as jest.Mock).mockRejectedValueOnce(
        new Error('DB error')
      );
      req.params = { id: '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6' };
      await userController.removeById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'DB error'
      });
    });
  });

  describe('list', () => {
    it('should return 500 on unexpected error', async () => {
      (userRepository.findAll as jest.Mock).mockRejectedValueOnce(
        new Error('DB error')
      );
      req.params = {};
      req.query = {};

      await userController.listAll(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'DB error'
      });
    });
  });
});
