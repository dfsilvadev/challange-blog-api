import {
  parseDate,
  parseBoolean,
  parseNumber,
  parseOrder
} from '../../utils/parses/parsers';

describe('parseDate', () => {
  it('should return a Date instance for valid strings', () => {
    const date = parseDate('2024-01-01');
    expect(date).toBeInstanceOf(Date);
    expect(date?.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('should return undefined for non-string values', () => {
    expect(parseDate(undefined)).toBeUndefined();
    expect(parseDate(null)).toBeUndefined();
    expect(parseDate(123)).toBeUndefined();
  });
});

describe('parseBoolean', () => {
  it('should return false when value is "false"', () => {
    expect(parseBoolean('false')).toBe(false);
  });

  it('should return true when value is "true"', () => {
    expect(parseBoolean('true')).toBe(true);
  });

  it('should return defaultValue when value is unknown', () => {
    expect(parseBoolean('invalid', false)).toBe(false);
    expect(parseBoolean(undefined, true)).toBe(true);
    expect(parseBoolean(null, false)).toBe(false);
  });
});

describe('parseNumber', () => {
  it('should correctly return the integer number', () => {
    expect(parseNumber('10', 0)).toBe(10);
    expect(parseNumber('0', 999)).toBe(0);
  });

  it('should return defaultValue if value is not a string', () => {
    expect(parseNumber(123, 99)).toBe(99);
    expect(parseNumber(undefined, 50)).toBe(50);
  });

  it('should return defaultValue if value is an invalid string', () => {
    expect(parseNumber('abc', 5)).toBe(5);
  });
});

describe('parseOrder', () => {
  it('should return "ASC" if value is "asc"', () => {
    expect(parseOrder('asc')).toBe('ASC');
  });

  it('should return "DESC" if value is "desc"', () => {
    expect(parseOrder('desc')).toBe('DESC');
  });

  it('should return "DESC" if value is invalid or not a string', () => {
    expect(parseOrder('up')).toBe('DESC');
    expect(parseOrder(123)).toBe('DESC');
    expect(parseOrder(undefined)).toBe('DESC');
  });
});
