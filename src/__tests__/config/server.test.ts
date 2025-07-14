import app from '../../main';

jest.mock('../../main', () => ({
  listen: jest.fn((port, cb) => cb?.())
}));

import '../../server'; // importa o arquivo que chama app.listen

test('server inicia e chama listen', () => {
  expect(app.listen).toHaveBeenCalled();
  expect(app.listen).toHaveBeenCalledWith(
    expect.any(Number),
    expect.any(Function)
  );
});
