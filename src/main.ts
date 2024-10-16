import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TypeOrmFilter } from './filters/typeorm.filter';
import { ValidationPipe } from '@nestjs/common';
import { GlobalInterceptors } from './interceptors/global.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Input your JWT token',
        name: 'Authorization',
        in: 'header',
      },
      'bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      security: [{ bearer: [] }],
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new TypeOrmFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new GlobalInterceptors());

  await app.listen(3000);
}
bootstrap();
