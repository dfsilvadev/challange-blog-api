jest.mock('express', () => {
  const actualExpress = jest.requireActual('express');
  const listen = jest.fn((port, cb) => cb && cb());
  const expressMock = () => {
    const app = actualExpress();
    app.listen = listen;
    return app;
  };
  expressMock.json = jest.fn(() => (_req: any, _res: any, next: any) => next());
  expressMock.Router = actualExpress.Router;
  expressMock.__listen = listen;
  return expressMock;
});

jest.mock('pg', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(undefined),
      query: jest.fn().mockResolvedValue({ rows: [] })
    })),
    types: {
      setTypeParser: jest.fn()
    },
    QueryResultRow: jest.fn()
  };
});

describe('main.ts', () => {
  it('should start the server and call listen', () => {
    jest.resetModules();
    try {
      // Mock process.exit to prevent test runner from exiting
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      require('../main.ts'); // Executa o main.ts
      exitSpy.mockRestore();
    } catch (error) {
      // Log the error for debugging
      // eslint-disable-next-line no-console
      console.error('Error requiring main.ts:', error);
      throw error;
    }

    // Recupera o mock do listen do mock do express
    const express = require('express');
    const listen = express.__listen;

    expect(listen).toHaveBeenCalled();
    expect(listen).toHaveBeenCalledWith(3000, expect.any(Function));
  });
});
