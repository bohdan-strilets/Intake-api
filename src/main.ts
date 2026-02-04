import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/errors';
import { parseCorsList } from './common/lib/cors';
import { createValidationPipe } from './common/pipes';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.getOrThrow<number>('PORT', 3000);
  const corsOrigins = config.getOrThrow<string>('CORS_ORIGINS');

  app.enableCors({ origin: parseCorsList(corsOrigins), credentials: true });

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  setupSwagger(app);

  await app.listen(port);
}
void bootstrap();
