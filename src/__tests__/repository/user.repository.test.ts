import {
  findUserByEmailOrName,
  findUserById,
  alter,
  alterPassword,
  create
} from '../../app/repositories/userRepository';

import { query } from '../../database/db';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

const mockedQuery = query as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('userRepository', () => {
  describe('findUserByEmailOrName', () => {
    it('deve retornar um usuário quando encontrado por e-mail ou nome', async () => {
      const mockUser = {
        id: uuidv4(),
        name: 'teste',
        email: 'teste@email.com',
        phone: '11987654321',
        password_hash: 'hash123'
      };

      mockedQuery.mockResolvedValueOnce([mockUser]);

      const result = await findUserByEmailOrName('teste@email.com');

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['teste@email.com']
      );
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null se nenhum usuário for encontrado', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      const result = await findUserByEmailOrName('inexistente@email.com');
      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('deve retornar um usuário quando encontrado por id', async () => {
      const id = uuidv4();
      const mockUser = {
        id,
        email: 'teste@email.com',
        name: 'teste',
        phone: '11912345678',
        roleid: uuidv4()
      };

      mockedQuery.mockResolvedValueOnce([mockUser]);

      const result = await findUserById(id);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [id]
      );
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null se nenhum usuário for encontrado', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      const result = await findUserById(uuidv4());
      expect(result).toBeNull();
    });
  });

  describe('alter', () => {
    it('deve atualizar um usuário e retornar a linha modificada', async () => {
      const mockUser = {
        id: uuidv4(),
        email: 'teste@email.com',
        name: 'teste',
        phone: '11900001111',
        roleid: uuidv4()
      };

      mockedQuery.mockResolvedValueOnce([mockUser]);

      const result = await alter(mockUser);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        [
          mockUser.id,
          mockUser.name,
          mockUser.email,
          mockUser.phone,
          mockUser.roleid
        ]
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('alterPassword', () => {
    it('deve alterar a senha de um usuário e retornar a linha modificada', async () => {
      const userPassword = {
        id: uuidv4(),
        password_hash: 'newhash123'
      };

      mockedQuery.mockResolvedValueOnce([userPassword]);

      const result = await alterPassword(userPassword);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        [userPassword.id, userPassword.password_hash]
      );
      expect(result).toEqual(userPassword);
    });
  });

  describe('create', () => {
    it('deve criar um usuário e retornar a linha criada', async () => {
      const newUser = {
        name: 'teste',
        email: 'teste@email.com',
        phone: '11999998888',
        password_hash: 'senha123',
        roleId: uuidv4()
      };

      const createdUser = { id: uuidv4(), ...newUser };

      mockedQuery.mockResolvedValueOnce([createdUser]);

      const result = await create(newUser);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT'),
        [
          newUser.name,
          newUser.email,
          newUser.phone,
          newUser.password_hash,
          newUser.roleId
        ]
      );
      expect(result).toEqual(createdUser);
    });
  });
});
