export function parseDate(value: unknown): Date | undefined {
  return typeof value === 'string' ? new Date(value) : undefined;
}

export function parseBoolean(value: unknown, defaultValue = true): boolean {
  if (value === 'false') return false;
  if (value === 'true') return true;
  return defaultValue;
}

export function parseNumber(value: unknown, defaultValue: number): number {
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

export function parseOrder(value: unknown): 'ASC' | 'DESC' {
  if (typeof value === 'string') {
    const upper = value.toUpperCase();
    if (upper === 'ASC' || upper === 'DESC') return upper;
  }
  return 'DESC';
}
