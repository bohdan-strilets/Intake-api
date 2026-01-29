import { ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongooseConfig = (): MongooseModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    uri: config.getOrThrow<string>('MONGO_URI', { infer: true }),

    retryAttempts: 5,
    retryDelay: 3000,

    autoIndex: false,
    serverSelectionTimeoutMS: 5000,
  }),
});
