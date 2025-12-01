import bcrypt from 'bcryptjs';
import { Request, RequestHandler, Response } from 'express';

import * as roleRepository from '../repositories/roleRepository';
import * as userRepository from '../repositories/userRepository';
import { getPagination } from '../../utils/pagination/pagination';

export const create: RequestHandler = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  try {
    const ROLE_NAME = 'teacher';
    const role = await roleRepository.findIdByName(ROLE_NAME);

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

export const getAllUsersWithPagination: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { page = 1, limit = 10, orderBy = 'ASC' } = req.query;

    const currentPage = Number(page);
    const currentLimit = Number(limit);

    const validOrder =
      typeof orderBy === 'string' && (orderBy === 'ASC' || orderBy === 'DESC')
        ? orderBy
        : 'ASC';

    const [users, total] = await Promise.all([
      userRepository.findAll({
        page: currentPage,
        limit: currentLimit,
        orderBy: validOrder
      }),
      userRepository.findAll.length
    ]);
    const pagination = getPagination(total, currentPage, currentLimit);

    res.status(200).json({
      status: 'Ok',
      details: users,
      pagination
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};
