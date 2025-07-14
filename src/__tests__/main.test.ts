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

describe('main.ts', () => {
  it('should start the server and call listen', () => {
    jest.resetModules();
    require('../main'); // Executa o main.ts

    // Recupera o mock do listen do mock do express
    const express = require('express');
    const listen = express.__listen;

    expect(listen).toHaveBeenCalled();
    expect(listen).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Function)
    );
  });
});
