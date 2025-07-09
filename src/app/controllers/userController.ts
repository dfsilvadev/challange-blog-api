import { create } from '../repositories/userRepository';
import { findIdByName } from '../repositories/roleRepository';
import { Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcryptjs';

export const createUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { name, email, phone, password } = req.body;

  try {
    const role = await findIdByName('teacher');
    /* 
    Criptografar a senha 
    - Determina quantas vezes o algoritmo vai aplicar o hash
    - 10 significa que o algoritmo faz 2¹⁰ = 1024 iterações internas.
    */
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const post = await create(name, email, phone, password_hash, role);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: true, details: err });
  }
};
