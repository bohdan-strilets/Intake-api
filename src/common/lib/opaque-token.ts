import * as crypto from 'crypto';

/** Generates a random opaque token and its SHA-256 hash (for secure storage). */
export const generateOpaqueToken = (): { raw: string; hash: string } => {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = hashOpaqueToken(raw);
  return { raw, hash };
};

/** Returns SHA-256 hex hash of an opaque token (e.g. for comparison with stored hash). */
export const hashOpaqueToken = (rawToken: string): string => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};
