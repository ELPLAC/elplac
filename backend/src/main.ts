import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Habilitar CORS amplio para dominios de Vercel y Localhost
  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes('vercel.app') ||
        origin.includes('localhost')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Permite acceso si difiere la URL exacta
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const port = process.env.PORT || 3000;
  // Es fundamental pasar '0.0.0.0' para que Railway exponga la interfaz de red correctamente
  await app.listen(port, '0.0.0.0');
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
}

bootstrap();