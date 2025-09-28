import { Request, Response } from 'express';
import * as comentarioRepository from '../repositories/comentarioRepository';
import * as postRepository from '../repositories/postRepository';

/**
 * Controllers para as operações de Comentário (Criar e Listar)
 */

// Controller para CRIAR um novo comentário (POST)
// O tipo será inferido como AsyncMiddleware, resolvendo o erro TS2345.
export const create = async (req: Request, res: Response) => {
  const { conteudo, autor_nome, post_id } = req.body;

  try {
    // 1. Verificar se o Post existe (garantindo que o comentário não exista sem o post)
    const post = await postRepository.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
    }

    // 2. Criar o comentário
    const comentario = await comentarioRepository.create({
      conteudo,
      autor_nome,
      post_id
    });

    res.status(201).json({ status: 'OK', details: comentario });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

// Controller para LISTAR comentários de um post (GET)
// O tipo será inferido como AsyncMiddleware, resolvendo o erro TS2345.
export const list = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    // 1. Verificar se o Post existe (usando o ID do parâmetro)
    const post = await postRepository.findById(postId);
    if (!post) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
    }

    // 2. Buscar os comentários
    const comentarios = await comentarioRepository.findAllByPostId(postId);

    res.status(200).json({ status: 'OK', details: comentarios });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};
