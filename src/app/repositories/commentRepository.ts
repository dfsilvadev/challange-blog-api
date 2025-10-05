import { query } from '../../database/db';
import { Comment, CreateCommentParams } from './models/postRepositoryTypes';

/**
 * Esta camada lida com o acesso direto ao banco de dados para a tabela 'comments'.
 */

export const create = async ({
  conteudo,
  autor_nome,
  post_id
}: CreateCommentParams): Promise<Comment> => {
  const [row] = await query<Comment>(
    `
     INSERT INTO comments
      (id, conteudo, autor_nome, post_id)
      VALUES(uuid_generate_v4(), $1, $2, $3)
      RETURNING *
      `,
    [conteudo, autor_nome, post_id]
  );
  return row;
};

export const findAllByPostId = async (postId: string): Promise<Comment[]> => {
  const rows = await query<Comment>(
    `
    SELECT id, conteudo, autor_nome, created_at, updated_at, post_id
    FROM comments
    WHERE post_id = $1
    ORDER BY created_at ASC
    `,
    [postId]
  );
  return rows;
};
