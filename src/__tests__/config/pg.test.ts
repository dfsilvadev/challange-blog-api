import {
  pool,
  connectToDatabase,
  disconnectFromDatabase,
  query
} from '../../database/db';

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn()
  };
  const mTypes = { setTypeParser: jest.fn() };
  return {
    Pool: jest.fn(() => mPool),
    types: mTypes
  };
});

describe('Módulo de banco de dados', () => {
  // 'pool' aqui é o mock criado pelo jest.mock
  const mPool = pool as unknown as {
    query: jest.Mock;
    end: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('connectToDatabase chama pool.query com SELECT 1', async () => {
    mPool.query.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });
    await connectToDatabase();
    expect(mPool.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('disconnectFromDatabase chama pool.end', async () => {
    mPool.end.mockResolvedValueOnce(undefined);
    await disconnectFromDatabase();
    expect(mPool.end).toHaveBeenCalled();
  });

  it('query chama pool.query e retorna as linhas', async () => {
    const fakeRows = [{ id: 1, name: 'John' }];
    mPool.query.mockResolvedValueOnce({ rows: fakeRows });
    const result = await query('SELECT * FROM users');
    expect(mPool.query).toHaveBeenCalledWith('SELECT * FROM users', undefined);
    expect(result).toEqual(fakeRows);
  });

  it('query chama pool.query com parâmetros e retorna as linhas', async () => {
    const fakeRows = [{ id: 2, name: 'Jane' }];
    const params = [2];
    mPool.query.mockResolvedValueOnce({ rows: fakeRows });
    const result = await query('SELECT * FROM users WHERE id = $1', params);
    expect(mPool.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE id = $1',
      params
    );
    expect(result).toEqual(fakeRows);
  });
});
