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
  });

  it('should start the server and call listen', () => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';
    require('../main');
    const express = require('express');
    const listen = express.__listen;
    expect(listen).toHaveBeenCalled();
    expect(listen).toHaveBeenCalledWith(3000, expect.any(Function));
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
