jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

import * as roleRepository from '../../app/repositories/roleRepository';

import { query } from '../../database/db';

describe('findIdByName', () => {
  it('should return the id when found in the database', async () => {
    (query as jest.Mock).mockResolvedValue([{ id: 'role-123' }]);

    const result = await roleRepository.findIdByName('admin');

    expect(query).toHaveBeenCalledWith(expect.any(String), ['admin']);
    expect(result).toBe('role-123');
  });

  it('should return an empty string if rows[0].id is false', async () => {
    (query as jest.Mock).mockResolvedValue([{}]);

    const result = await roleRepository.findIdByName('no-id');

    expect(result).toBe('');
  });
});

describe('findById', () => {
  it('should return the id when found in the database', async () => {
    (query as jest.Mock).mockResolvedValue([
      { id: 'role-123', name: 'student' }
    ]);
    const role = { id: 'role-123', name: 'student' };

    const result = await roleRepository.findById('role-123');

    expect(query).toHaveBeenCalledWith(expect.any(String), ['role-123']);
    expect(result).toEqual(role);
  });

  it('should return null if not found', async () => {
    (query as jest.Mock).mockResolvedValue([]);

    const result = await roleRepository.findById('not-found-id');

    expect(result).toBeNull();
  });

  it('should propagate database error', async () => {
    (query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    await expect(roleRepository.findById('role-123')).rejects.toThrow(
      'DB error'
    );
  });
});

describe('findUserByRoleId', () => {
  it('should return role when found for user', async () => {
    (query as jest.Mock).mockResolvedValue([{ id: 'role-1', name: 'teacher' }]);
    const result = await roleRepository.findUserByRoleId('role-1', 'user-1');
    expect(query).toHaveBeenCalledWith(expect.any(String), [
      'role-1',
      'user-1'
    ]);
    expect(result).toEqual({ id: 'role-1', name: 'teacher' });
  });

  it('should return null if role not found for user', async () => {
    (query as jest.Mock).mockResolvedValue([]);
    const result = await roleRepository.findUserByRoleId('role-x', 'user-x');
    expect(result).toBeNull();
  });

  it('should propagate database error', async () => {
    (query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    await expect(
      roleRepository.findUserByRoleId('role-1', 'user-1')
    ).rejects.toThrow('DB error');
  });
});
