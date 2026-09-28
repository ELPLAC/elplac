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

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Habilitación completa y segura de CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman o server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'https://elplac-ruby.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
      ];

      // Permitir dominios listados o cualquier preview de vercel (*.vercel.app)
      if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // O puedes pasar callback(new Error('Not allowed by CORS')) en producción estricta
      }
    },
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
    credentials: true, 
  });  
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on port ${port}`);
}

bootstrap();