import * as crypto from 'crypto';

export const generateOpaqueToken = (): { raw: string; hash: string } => {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = hashOpaqueToken(raw);
  return { raw, hash };
};

export const hashOpaqueToken = (rawToken: string): string => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};