import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'global',
          ttl: Number(config.getOrThrow<number>('RATE_LIMIT_GLOBAL_TTL')),
          limit: Number(config.getOrThrow<number>('RATE_LIMIT_GLOBAL_LIMIT')),
        },
        {
          name: 'auth',
          ttl: Number(config.getOrThrow<number>('RATE_LIMIT_AUTH_TTL')),
          limit: Number(config.getOrThrow<number>('RATE_LIMIT_AUTH_LIMIT')),
        },
        {
          name: 'refresh',
          ttl: Number(config.getOrThrow<number>('RATE_LIMIT_REFRESH_TTL')),
          limit: Number(config.getOrThrow<number>('RATE_LIMIT_REFRESH_LIMIT')),
        },
        {
          name: 'ai',
          ttl: Number(config.getOrThrow<number>('RATE_LIMIT_AI_TTL')),
          limit: Number(config.getOrThrow<number>('RATE_LIMIT_AI_LIMIT')),
        },
      ],
    }),
  ],
})
export class RateLimitModule {}
