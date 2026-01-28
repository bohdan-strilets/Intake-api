import z from 'zod';

export { z };

export type Infer<T extends z.ZodTypeAny> = z.infer<T>;
