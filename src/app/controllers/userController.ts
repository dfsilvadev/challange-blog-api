import bcrypt from 'bcryptjs';
import { Request, RequestHandler, Response } from 'express';
import { findIdByName } from '../repositories/roleRepository';
import { create, findUserById } from '../repositories/userRepository';

export const createUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { name, email, phone, password } = req.body;

  try {
    const ROLE_NAME = 'teacher';
    const role = await findIdByName(ROLE_NAME);
    const roleId = typeof role === 'string' ? role : role?.id || '';

    /*
    Criptografar a senha
    - Determina quantas vezes o algoritmo vai aplicar o hash
    - 10 significa que o algoritmo faz 2¹⁰ = 1024 iterações internas.
    */
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = await create({
      name,
      email,
      phone,
      password_hash,
      roleId
    });
    res.status(201).json({ status: 'OK', details: { user } });
  } catch (err) {
    res.status(500).json({ error: true, details: err });
  }
};

export const getUser: RequestHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const user = await findUserById(id);

    res.status(200).json({ status: 'OK', details: { user } });
  } catch (err) {
    res.status(500).json({ error: true, details: err });
  }
};
