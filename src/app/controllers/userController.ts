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

export const updateById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { name, email, phone, roleName } = req.body;
  let roleExists: string | undefined;

  try {
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_USER' });
    }

    if (roleName) {
      roleExists = await roleRepository.findIdByName(roleName);
      if (!roleExists) {
        return res.status(404).json({ error: true, details: 'NOT_FOUND_ROLE' });
      }
    }

    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (roleName !== undefined) updateFields.roleId = roleExists;

    const updated = await userRepository.update(id, updateFields);
    res.status(200).json({ status: 'OK', details: updated });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

export const removeById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  // @ts-ignore: user populado pelo middleware de autenticação
  const loggedUserId = req.user?.id;
  // @ts-ignore: user populado pelo middleware de autenticação
  const loggedUserRole = req.user?.role;

  try {
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_USER' });
    }
    if (!loggedUserId) {
      return res.status(401).json({ error: true, details: 'UNAUTHORIZED' });
    }

    if (loggedUserId !== id && loggedUserRole !== 'coordinator') {
      return res
        .status(403)
        .json({ error: true, details: 'FORBIDDEN_USER_DELETION' });
    }

    await userRepository.deleteOne(id);
    res.status(200).json({ status: 'OK', details: 'USER_DELETED' });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};
