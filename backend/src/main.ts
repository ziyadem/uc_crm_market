import type { INestApplication } from '@nestjs/common'
import { appConfig, swaggerConfig } from '@config'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { App } from 'app'
import { SwaggerModule } from '@nestjs/swagger'

setImmediate(async (): Promise<void> => {
  const app = await NestFactory.create<INestApplication>(App)

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe())

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  })

  await app.listen(appConfig.port)
})
