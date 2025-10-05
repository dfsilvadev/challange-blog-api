import { query } from '../../database/db';
import { Comment, CreateCommentParams } from './models/postRepositoryTypes';

/**
 * Esta camada lida com o acesso direto ao banco de dados para a tabela 'tb_comments'.
 */

export const create = async ({
  content,
  author,
  post_id
}: CreateCommentParams): Promise<Comment> => {
  const [row] = await query<Comment>(
    `
     INSERT INTO tb_comments
      (id, content, author, post_id)
      VALUES(uuid_generate_v4(), $1, $2, $3)
      RETURNING *
      `,
    [content, author, post_id]
  );
  return row;
};

export const findAllByPostId = async (postId: string): Promise<Comment[]> => {
  const rows = await query<Comment>(
    `
    SELECT id, content, author, created_at, updated_at, post_id
    FROM tb_comments
    WHERE post_id = $1
    ORDER BY created_at ASC
    `,
    [postId]
  );
  return rows;
};
