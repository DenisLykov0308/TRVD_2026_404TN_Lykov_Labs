import { Decimal } from '@prisma/client/runtime/library';

export function decimalToNumber(value: Decimal | number | string): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return Number(value);
  }

  return value.toNumber();
}
