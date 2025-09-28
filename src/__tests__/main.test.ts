import { NextFunction, Request, Response } from 'express';

jest.mock('express', () => {
  const actualExpress = jest.requireActual('express');
  const listen = jest.fn((port, cb) => cb && cb());
  const expressMock = () => {
    const app = actualExpress();
    app.listen = listen;
    return app;
  };
  expressMock.json = jest.fn(
    () => (_req: Request, _res: Response, next: NextFunction) => next()
  );
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
  afterEach(() => {
    jest.resetModules();
    delete process.env.NODE_ENV;
    delete process.env.PORT;
  });

  it('should start the server and call listen', () => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';

    // 1. Define a porta
    process.env.PORT = '3001';

    // 2. Carrega o módulo config APÓS definir o ambiente
    const config = require('../utils/config/config').default;
    const currentPort = config.port;

    require('../main');
    const express = require('express');
    const listen = express.__listen;

    // Agora 'currentPort' será 3001, e o teste deve passar.
    expect(listen).toHaveBeenCalled();
    expect(listen).toHaveBeenCalledWith(currentPort, expect.any(Function));
  });

  it('should NOT start the server in test environment', () => {
    jest.resetModules();
    process.env.NODE_ENV = 'test';
    require('../main');
    const express = require('express');
    const listen = express.__listen;
    expect(listen).not.toHaveBeenCalled();
  });
});
