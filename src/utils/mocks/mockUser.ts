import { v4 as uuidv4 } from 'uuid';

const roleFake = uuidv4();
const idFake = uuidv4();
const mockUser = {
  id: idFake,
  name: 'teste',
  email: 'teste@email.com',
  phone: '11999999999',
  password_hash: 'hashedPassword',
  roleId: roleFake
};

export { idFake, mockUser, roleFake };
