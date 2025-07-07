/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import * as express from 'express';

dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 🔧 OPTIMIZACIÓN DE LOGGING - Configurable
    logger: process.env.LOG_LEVEL ? [process.env.LOG_LEVEL as any] : 
      (process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug']), 
    
    // 🚀 CONFIGURACIÓN DE MEMORIA
    bodyParser: true,
    rawBody: true,
    bufferLogs: false, // No almacenar logs en buffer
  });

  // 🔧 CONFIGURACIÓN DE VALIDACIÓN OPTIMIZADA
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    disableErrorMessages: process.env.NODE_ENV === 'production',
    // Nota: maxRequestBodySize se configura en el servidor, no en ValidationPipe
  }));

  // 🚀 CONFIGURACIÓN DE LÍMITES DE BODY SIZE
  app.use(express.json({ limit: `${process.env.MAX_REQUEST_BODY_SIZE || 10}mb` }));
  app.use(express.urlencoded({ extended: true, limit: `${process.env.MAX_REQUEST_BODY_SIZE || 10}mb` }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  // 🔧 CORS OPTIMIZADO
  app.enableCors({
    origin: [
      "https://elplac-ruby.vercel.app", 
      "http://localhost:3001", 
    ],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
    optionsSuccessStatus: 200, // Para compatibility con browsers legacy
    maxAge: 86400, // Cache preflight por 24 horas
  });

  // 🔧 CONFIGURACIÓN DE LÍMITES DE SERVIDOR
  const server = await app.listen(process.env.PORT || 3000);
  
  // 🚀 LÍMITES DE CONEXIÓN CONFIGURABLES
  server.setTimeout(Number(process.env.SERVER_TIMEOUT) || 300000); // Timeout configurable
  server.keepAliveTimeout = Number(process.env.KEEP_ALIVE_TIMEOUT) || 65000; // Keep-alive configurable
  server.headersTimeout = Number(process.env.HEADERS_TIMEOUT) || 66000; // Headers timeout configurable

  // 🧹 MONITOREO DE MEMORIA CONFIGURABLE
  const memoryMonitorInterval = Number(process.env.MEMORY_MONITOR_INTERVAL) || 30000;
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const memUsage = process.memoryUsage();
      console.log('🔍 Memory usage:', {
        rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
        external: Math.round(memUsage.external / 1024 / 1024) + 'MB',
      });
    }, memoryMonitorInterval);
  }

  // 🚀 GARBAGE COLLECTION MANUAL CONFIGURABLE
  if (process.env.ENABLE_MANUAL_GC === 'true' && global.gc) {
    setInterval(() => {
      global.gc();
      console.log('🧹 Manual GC executed');
    }, 120000); // Cada 2 minutos
  }

  // 🔧 GRACEFUL SHUTDOWN - CRÍTICO PARA EVITAR MEMORY LEAKS
  const gracefulShutdown = async (signal: string) => {
    console.log(`🔄 ${signal} received, closing gracefully...`);
    
    // Cerrar servidor HTTP
    server.close(() => {
      console.log('✅ HTTP server closed');
    });
    
    // Cerrar aplicación NestJS
    await app.close();
    console.log('✅ NestJS app closed');
    
    // Forzar limpieza de memoria
    if (global.gc) {
      global.gc();
      console.log('🧹 Final GC executed');
    }
    
    process.exit(0);
  };

  // 🚨 LISTENERS DE SHUTDOWN
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // 🚨 HANDLER DE ERRORES NO CAPTURADOS
  process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
  });

  // 🚀 ADVERTENCIA DE MEMORY LEAKS
  process.on('warning', (warning) => {
    if (warning.name === 'MaxListenersExceededWarning') {
      console.warn('⚠️ Memory leak detected - MaxListenersExceededWarning');
    }
  });

  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 3000}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Node version: ${process.version}`);
  console.log(`💾 Memory limit: ${process.env.NODE_OPTIONS || 'default'}`);
}

bootstrap().catch((error) => {
  console.error('💥 Application failed to start:', error);
  process.exit(1);
});