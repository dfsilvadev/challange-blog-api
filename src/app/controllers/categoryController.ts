import { Request, Response } from 'express';
import * as categoryRepository from '../repositories/categoryRepository';

const getCategoryAll = async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepository.findAll();

    res.status(200).json({
      status: 'Ok',
      details: categories
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

export const list = getCategoryAll;
