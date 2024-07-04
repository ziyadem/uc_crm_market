import { DocumentBuilder } from '@nestjs/swagger'

export const swaggerConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('CRM Swagger')
  .setDescription('The nestjs and swager API description')
  .setVersion('1.0.0')
  .build()
