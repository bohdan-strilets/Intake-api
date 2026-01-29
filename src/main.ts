import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { createValidationPipe } from './common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('PORT', 3000);

  app.useGlobalPipes(createValidationPipe());

  await app.listen(port);
}
void bootstrap();
