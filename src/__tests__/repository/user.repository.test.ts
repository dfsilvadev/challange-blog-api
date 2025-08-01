import { v4 as uuidv4 } from 'uuid';
import { query } from '../../database/db';

import * as userRepository from '../../app/repositories/userRepository';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

const mockedQuery = query as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('userRepository', () => {
  describe('findUserByEmailOrName', () => {
    it('should return a user when found by email or name', async () => {
      const mockUser = {
        id: uuidv4(),
        name: 'teste',
        email: 'teste@email.com',
        phone: '11987654321',
        password_hash: 'hash123'
      };

      mockedQuery.mockResolvedValueOnce([mockUser]);

      const result = await userRepository.findByEmailOrName('teste@email.com');

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['teste@email.com']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      const result = await userRepository.findByEmailOrName(
        'inexistente@email.com'
      );
      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should return a user when found by id', async () => {
      const id = uuidv4();
      const mockUser = {
        id,
        email: 'teste@email.com',
        name: 'teste',
        phone: '11912345678',
        roleid: uuidv4()
      };

      mockedQuery.mockResolvedValueOnce([mockUser]);

      const result = await userRepository.findById(id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [id]
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      const result = await userRepository.findById(uuidv4());
      expect(result).toBeNull();
    });
  });

  describe('alter', () => {
    it('should update a user and return the modified row', async () => {
      const mockUser = {
        id: uuidv4(),
        email: 'teste@email.com',
        name: 'teste',
        phone: '11900001111',
        roleId: uuidv4()
      };

      mockedQuery.mockResolvedValueOnce([mockUser]);

      const result = await userRepository.alter(mockUser);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        [
          mockUser.id,
          mockUser.name,
          mockUser.email,
          mockUser.phone,
          mockUser.roleId
        ]
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('alterPassword', () => {
    it('should update a user password and return the modified row', async () => {
      const userPassword = {
        id: uuidv4(),
        passwordHash: 'newhash123'
      };

      mockedQuery.mockResolvedValueOnce([userPassword]);

      const result = await userRepository.alterPassword(userPassword);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        [userPassword.id, userPassword.passwordHash]
      );
      expect(result).toEqual(userPassword);
    });
  });

  describe('create', () => {
    it('should create a user and return the created row', async () => {
      const newUser = {
        name: 'teste',
        email: 'teste@email.com',
        phone: '11999998888',
        passwordHash: 'senha123',
        roleId: uuidv4()
      };

      const createdUser = { id: uuidv4(), ...newUser };

      mockedQuery.mockResolvedValueOnce([createdUser]);

      const result = await userRepository.create(newUser);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT'),
        [
          newUser.name,
          newUser.email,
          newUser.phone,
          newUser.passwordHash,
          newUser.roleId
        ]
      );
      expect(result).toEqual(createdUser);
    });
  });
});
