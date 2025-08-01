import { v4 as uuidv4 } from 'uuid';
import { query } from '../../database/db';

import * as userRepository from '../../app/repositories/userRepository';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

const mockUser = {
  id: uuidv4(),
  name: 'Usuário Teste',
  email: 'teste@email.com',
  phone: '11999999999',
  passwordHash: 'hash',
  roleId: uuidv4(),
  password_hash: 'hash',
  role_id: uuidv4()
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('userRepository', () => {
  describe('create', () => {
    it('should insert user and return created object', async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);
      const result = await userRepository.create({
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        passwordHash: mockUser.passwordHash,
        roleId: mockUser.roleId
      });
      expect(result).toEqual(mockUser);
    });
    it('should propagate database error', async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
      await expect(
        userRepository.create({
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone,
          passwordHash: mockUser.passwordHash,
          roleId: mockUser.roleId
        })
      ).rejects.toThrow('DB error');
    });
    it('should pass correct parameters to query', async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);
      await userRepository.create({
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        passwordHash: mockUser.passwordHash,
        roleId: mockUser.roleId
      });
      expect(query).toHaveBeenCalledWith(expect.any(String), [
        mockUser.name,
        mockUser.email,
        mockUser.phone,
        mockUser.passwordHash,
        mockUser.roleId
      ]);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);
      const result = await userRepository.findById(mockUser.id);
      expect(result).toEqual(mockUser);
    });
    it('should return undefined if not found', async () => {
      (query as jest.Mock).mockResolvedValueOnce([]);
      const result = await userRepository.findById('not-found-id');
      expect(result).toBeUndefined();
    });
    it('should propagate database error', async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
      await expect(userRepository.findById(mockUser.id)).rejects.toThrow(
        'DB error'
      );
    });
  });

  describe('findByEmailOrName', () => {
    it('should return user if found', async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);
      const result = await userRepository.findByEmailOrName(mockUser.email);
      expect(result).toEqual(mockUser);
    });
    it('should return undefined if not found', async () => {
      (query as jest.Mock).mockResolvedValueOnce([]);
      const result = await userRepository.findByEmailOrName(
        'not-found@email.com'
      );
      expect(result).toBeUndefined();
    });
    it('should propagate database error', async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
      await expect(
        userRepository.findByEmailOrName(mockUser.email)
      ).rejects.toThrow('DB error');
    });
  });

  describe('alter', () => {
    it('should update user and return updated object', async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);
      const result = await userRepository.alter({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        roleId: mockUser.roleId
      });
      expect(result).toEqual(mockUser);
    });
    it('should propagate database error', async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
      await expect(
        userRepository.alter({
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone,
          roleId: mockUser.roleId
        })
      ).rejects.toThrow('DB error');
    });
    it('should pass correct parameters to query', async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);
      await userRepository.alter({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        roleId: mockUser.roleId
      });
      expect(query).toHaveBeenCalledWith(expect.any(String), [
        mockUser.id,
        mockUser.name,
        mockUser.email,
        mockUser.phone,
        mockUser.roleId
      ]);
    });
  });

  describe('alterPassword', () => {
    it('should update password and return updated object', async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);
      const result = await userRepository.alterPassword({
        id: mockUser.id,
        passwordHash: mockUser.passwordHash
      });
      expect(result).toEqual(mockUser);
    });
    it('should propagate database error', async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
      await expect(
        userRepository.alterPassword({
          id: mockUser.id,
          passwordHash: mockUser.passwordHash
        })
      ).rejects.toThrow('DB error');
    });
    it('should pass correct parameters to query', async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);
      await userRepository.alterPassword({
        id: mockUser.id,
        passwordHash: mockUser.passwordHash
      });
      expect(query).toHaveBeenCalledWith(expect.any(String), [
        mockUser.id,
        mockUser.passwordHash
      ]);
    });
  });
});
