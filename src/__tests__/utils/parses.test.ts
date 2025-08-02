import {
  parseDate,
  parseBoolean,
  parseNumber,
  parseOrder
} from '../../utils/parses/parsers';

describe('parseDate', () => {
  it('deve retornar uma instância de Date para strings válidas', () => {
    const date = parseDate('2024-01-01');
    expect(date).toBeInstanceOf(Date);
    expect(date?.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('deve retornar undefined para valores não string', () => {
    expect(parseDate(undefined)).toBeUndefined();
    expect(parseDate(null)).toBeUndefined();
    expect(parseDate(123)).toBeUndefined();
  });
});

describe('parseBoolean', () => {
  it('deve retornar false quando valor é "false"', () => {
    expect(parseBoolean('false')).toBe(false);
  });

  it('deve retornar true quando valor é "true"', () => {
    expect(parseBoolean('true')).toBe(true);
  });

  it('deve retornar defaultValue quando valor é desconhecido', () => {
    expect(parseBoolean('invalid', false)).toBe(false);
    expect(parseBoolean(undefined, true)).toBe(true);
    expect(parseBoolean(null, false)).toBe(false);
  });
});

describe('parseNumber', () => {
  it('deve retornar o número inteiro corretamente', () => {
    expect(parseNumber('10', 0)).toBe(10);
    expect(parseNumber('0', 999)).toBe(0);
  });

  it('deve retornar defaultValue se valor não for string', () => {
    expect(parseNumber(123, 99)).toBe(99);
    expect(parseNumber(undefined, 50)).toBe(50);
  });

  it('deve retornar defaultValue se valor for string inválida', () => {
    expect(parseNumber('abc', 5)).toBe(5);
  });
});

describe('parseOrder', () => {
  it('deve retornar "ASC" se valor for "asc"', () => {
    expect(parseOrder('asc')).toBe('ASC');
  });

  it('deve retornar "DESC" se valor for "desc"', () => {
    expect(parseOrder('desc')).toBe('DESC');
  });

  it('deve retornar "DESC" se valor for inválido ou não string', () => {
    expect(parseOrder('up')).toBe('DESC');
    expect(parseOrder(123)).toBe('DESC');
    expect(parseOrder(undefined)).toBe('DESC');
  });
});
