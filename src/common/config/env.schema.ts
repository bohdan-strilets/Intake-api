import { z } from 'src/common/lib/zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.coerce.number().default(3000),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  SESSION_EXPIRES_DAYS: z.coerce.number().default(7),

  MONGO_URI: z.string().url(),

  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),

  OPENAI_API_KEY: z.string().min(1),
});
