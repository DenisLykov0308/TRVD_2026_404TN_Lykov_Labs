import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
  const logger = new Logger('Bootstrap');
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

  expressApp.get('/', (_req: any, res: any) => {
    res.redirect('/api');
  });

  app.setGlobalPrefix('v1');
  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Система обліку складу')
    .setDescription('REST API для лабораторної роботи №3 з дисципліни TRVD.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);

  logger.log(`Сервер запущено: http://localhost:${port}`);
  logger.log(`Swagger UI: http://localhost:${port}/api`);
}

bootstrap();
