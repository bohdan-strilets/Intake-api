import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

import { swaggerConfig } from './swagger.config';

export function setupSwagger(app: INestApplication): void {
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/docs', app, document);
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
}
