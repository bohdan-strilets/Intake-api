import { Infer } from 'src/common/lib/zod';

import { envSchema } from './env.schema';

export type EnvVars = Infer<typeof envSchema>;
