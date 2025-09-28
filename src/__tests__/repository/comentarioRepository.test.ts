import { v4 as uuidv4 } from 'uuid';
import * as comentarioRepository from '../../app/repositories/comentarioRepository';
import { query } from '../../database/db';
import { Comentario } from '../../app/repositories/models/postRepositoryTypes';

// Mocka a função de query do banco de dados
jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

const mockedQuery = query as jest.Mock;

const mockPostId = uuidv4();
const mockComentarios: Comentario[] = [
  {
    id: uuidv4(),
    conteudo: 'Ótimo post!',
    autor_nome: 'Aluno Teste 1',
    post_id: mockPostId,
    created_at: new Date('2025-01-01T10:00:00Z'),
    updated_at: new Date('2025-01-01T10:00:00Z')
  },
  {
    id: uuidv4(),
    conteudo: 'Concordo plenamente.',
    autor_nome: 'Aluno Teste 2',
    post_id: mockPostId,
    created_at: new Date('2025-01-01T10:05:00Z'),
    updated_at: new Date('2025-01-01T10:05:00Z')
  }
];

// Função utilitária para remover espaços em branco e quebras de linha do SQL.
const normalizeSql = (sql: string) => sql.trim().replace(/\s+/g, ' ');

describe('comentarioRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const newCommentData = {
      conteudo: 'Novo comentário de teste.',
      autor_nome: 'Testador',
      post_id: mockPostId
    };

    it('should insert comment and return created object', async () => {
      mockedQuery.mockResolvedValueOnce([
        {
          ...newCommentData,
          id: uuidv4(),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      const result = await comentarioRepository.create(newCommentData);

      const expectedSql = normalizeSql(`
         INSERT INTO comentarios (id, conteudo, autor_nome, post_id)
         VALUES(uuid_generate_v4(), $1, $2, $3)
         RETURNING *
      `);

      expect(query).toHaveBeenCalledTimes(1);

      // Usa toMatch com regex para ser flexível com o formato da string SQL.
      expect(normalizeSql(mockedQuery.mock.calls[0][0])).toBe(expectedSql);

      expect(result).toHaveProperty('id');
      expect(result.conteudo).toBe(newCommentData.conteudo);
    });

    it('should propagate database error', async () => {
      mockedQuery.mockRejectedValueOnce(new Error('DB error on create'));
      await expect(comentarioRepository.create(newCommentData)).rejects.toThrow(
        'DB error on create'
      );
    });
  });

  describe('findAllByPostId', () => {
    it('should return all comments for a given post ID', async () => {
      mockedQuery.mockResolvedValueOnce(mockComentarios);

      const result = await comentarioRepository.findAllByPostId(mockPostId);

      // Corrigindo a expectativa para selecionar as colunas conforme o código do repositório
      const expectedSql = normalizeSql(`
        SELECT id, conteudo, autor_nome, created_at, updated_at, post_id
        FROM comentarios
        WHERE post_id = $1
        ORDER BY created_at ASC
      `);

      expect(query).toHaveBeenCalledTimes(1);
      // Usa toMatch com regex para ser flexível com o formato da string SQL.
      expect(normalizeSql(mockedQuery.mock.calls[0][0])).toBe(expectedSql);
      expect(mockedQuery.mock.calls[0][1]).toEqual([mockPostId]);
      expect(result).toEqual(mockComentarios);
    });

    it('should return empty array if no comments are found', async () => {
      mockedQuery.mockResolvedValueOnce([]);

      const result = await comentarioRepository.findAllByPostId(uuidv4());

      expect(result).toEqual([]);
    });

    it('should propagate database error', async () => {
      mockedQuery.mockRejectedValueOnce(new Error('DB error on find'));
      await expect(
        comentarioRepository.findAllByPostId(mockPostId)
      ).rejects.toThrow('DB error on find');
    });
  });
});
