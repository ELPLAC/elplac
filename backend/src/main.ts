/* eslint-disable prettier/prettier */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], 
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: ["https://elplac.vercel.app", "http://localhost:3001", "https://elplac-git-main-florencias-projects-5e0cb0aa.vercel.app"], 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true, 
  });
  await app.listen(process.env.PORT);
}

bootstrap();
