export const verifyNumber = (value: any): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const parseNumber = parseInt(value);
  if (!Number.isNaN(parseNumber)) return parseNumber;
  return undefined;
}