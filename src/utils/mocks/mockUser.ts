import { v4 as uuidv4 } from 'uuid';

import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const generateRandomHash = (): string => {
  const randomString = crypto.randomBytes(10).toString('hex');
  return bcrypt.hashSync(randomString, 10);
};

const roleFake = uuidv4();
const roleFake2 = uuidv4();
const idFake = uuidv4();

const mockUser = {
  id: idFake,
  name: 'teste',
  email: 'teste@email.com',
  phone: '11999999999',
  password_hash: generateRandomHash(),
  roleId: roleFake
};

const mockList = [
  {
    id: idFake,
    name: 'testeA',
    email: 'teste1@email.com',
    phone: '11999999998',
    password_hash: generateRandomHash(),
    roleId: roleFake
  },
  {
    id: '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6',
    name: 'teste',
    email: 'teste@email.com',
    phone: '11999999999',
    password_hash: generateRandomHash(),
    roleId: roleFake2
  }
];

const mockPagination = {
  total: mockList.length,
  totalPages: 1,
  registersPerPage: 10,
  currentPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  nextPage: 0,
  previousPage: 0,
  firstPage: 0,
  lastPage: 0
};

export { idFake, mockUser, roleFake, mockPagination, mockList };
