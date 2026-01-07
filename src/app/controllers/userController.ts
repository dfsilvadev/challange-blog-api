import bcrypt from 'bcryptjs';
import { Request, RequestHandler, Response } from 'express';

import * as roleRepository from '../repositories/roleRepository';
import * as userRepository from '../repositories/userRepository';

import { getPagination } from '../../utils/pagination/pagination';
import { parseOrder, parseNumber } from '../../utils/parses/parsers';

export const listAll = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, orderBy = 'ASC' } = req.query;

    const currentPage = Number(page);
    const currentLimit = Number(limit);

    const validOrder =
      typeof orderBy === 'string' && (orderBy === 'ASC' || orderBy === 'DESC')
        ? orderBy
        : 'ASC';

    const [posts, total] = await Promise.all([
      userRepository.findAll({
        page: currentPage,
        limit: currentLimit,
        orderBy: validOrder
      }),
      userRepository.count()
    ]);
    const pagination = getPagination(total, currentPage, currentLimit);

    res.status(200).json({
      status: 'Ok',
      details: posts,
      pagination
    });
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

export const findByFilter = async (req: Request, res: Response) => {
  try {
    const filters = getFilters(req.query);

    const users = await userRepository.findByFilter({
      page: filters.page,
      limit: filters.limit,
      orderBy: filters.orderBy,
      name: filters.name,
      email: filters.email,
      roleName: filters.roleName
    });
    const pagination = getPagination(users.length, filters.page, filters.limit);

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

  try {
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_USER' });
    }

    await userRepository.deleteOne(id);
    res.status(200).json({ status: 'OK', details: 'USER_DELETED' });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

function getFilters(query: any) {
  return {
    roleName: query.roleName,
    email: query.email,
    name: query.name,
    orderBy: parseOrder(query.orderBy),
    page: parseNumber(query.page, 1),
    limit: parseNumber(query.limit, 10),
    search: typeof query.search === 'string' ? query.search : undefined
  };
}
