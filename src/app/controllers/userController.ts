import bcrypt from 'bcryptjs';
import { Request, RequestHandler, Response } from 'express';

import * as roleRepository from '../repositories/roleRepository';
import * as userRepository from '../repositories/userRepository';

export const create: RequestHandler = async (req: Request, res: Response) => {
  const { name, email, phone, password, roleName } = req.body;

  try {
    const role = await roleRepository.findIdByName(roleName);

    /*
    Criptografar a senha
    - Determina quantas vezes o algoritmo vai aplicar o hash
    - 10 significa que o algoritmo faz 2¹⁰ = 1024 iterações internas.
    */
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await userRepository.create({
      name,
      email,
      phone,
      passwordHash,
      roleId: role
    });
    res.status(201).json({ status: 'OK', details: user });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

export const findOne: RequestHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const user = await userRepository.findById(id);

    if (!user) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_USER' });
    }

    res.status(200).json({ status: 'OK', details: user });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};
