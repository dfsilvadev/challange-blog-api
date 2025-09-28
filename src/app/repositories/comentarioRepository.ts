import { query } from '../../database/db';
import {
  Comentario,
  CreateComentarioParams
} from './models/postRepositoryTypes';

/**
 * Esta camada lida com o acesso direto ao banco de dados para a tabela 'comentarios'.
 */

export const create = async ({
  conteudo,
  autor_nome,
  post_id
}: CreateComentarioParams): Promise<Comentario> => {
  const [row] = await query<Comentario>(
    `
     INSERT INTO comentarios
      (id, conteudo, autor_nome, post_id)
      VALUES(uuid_generate_v4(), $1, $2, $3)
      RETURNING *
      `,
    [conteudo, autor_nome, post_id]
  );
  return row;
};

export const findAllByPostId = async (
  postId: string
): Promise<Comentario[]> => {
  const rows = await query<Comentario>(
    `
    SELECT id, conteudo, autor_nome, created_at, updated_at, post_id
    FROM comentarios
    WHERE post_id = $1
    ORDER BY created_at ASC
    `,
    [postId]
  );
  return rows;
};
