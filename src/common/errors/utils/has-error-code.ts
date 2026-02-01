import { ErrorCode } from '../errors-codes';

export const hasErrorCode = (payload: unknown): payload is { code: ErrorCode } => {
  return typeof payload === 'object' && payload !== null && 'code' in payload;
};
