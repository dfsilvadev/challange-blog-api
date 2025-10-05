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

const getExists = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const exists = await categoryRepository.findById(id);

    res.status(200).json({
      status: 'Ok',
      details: exists
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

export const list = getCategoryAll;
export const exists = getExists;
