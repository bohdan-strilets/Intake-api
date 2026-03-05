import { z } from 'src/common/lib/zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.coerce.number().default(3000),
  CORS_ORIGINS: z.string(),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  SESSION_EXPIRES_DAYS: z.coerce.number().default(7),

  MONGO_URI: z.string().url(),

  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),

  OPENAI_API_KEY: z.string().min(1),

  RESEND_API_KEY: z.string().min(1),
  MAIL_FROM: z.string(),
  APP_URL: z.string().url(),

  PASSWORD_RESET_EXPIRES_MINUTES: z.coerce.number().default(60),
  EMAIL_VERIFICATION_EXPIRES_HOURS: z.coerce.number().default(24),

  

  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),

  RATE_LIMIT_GLOBAL_TTL: z.coerce.number().default(60),
  RATE_LIMIT_GLOBAL_LIMIT: z.coerce.number().default(100),
  RATE_LIMIT_AUTH_TTL: z.coerce.number().default(60),
  RATE_LIMIT_AUTH_LIMIT: z.coerce.number().default(20),
  RATE_LIMIT_REFRESH_TTL: z.coerce.number().default(60),
  RATE_LIMIT_REFRESH_LIMIT: z.coerce.number().default(10),
  RATE_LIMIT_AI_TTL: z.coerce.number().default(60),
  RATE_LIMIT_AI_LIMIT: z.coerce.number().default(15),
});