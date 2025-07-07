import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

import { Fair } from '@fairs/entities/fairs.entity';
import { UserFairRegistration } from '@fairs/entities/userFairRegistration.entity';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';
import { User } from '@users/users.entity';
import { Product } from '@products/entities/products.entity';
import { Seller } from '@sellers/sellers.entity';
import { PaymentTransaction } from '@payment_transaction/paymentTransaction.entity';
import { Category } from '@categories/categories.entity';
import { ProductRequest } from '@products/entities/productRequest.entity';
import { BuyerCapacity } from '@fairs/entities/buyersCapacity.entity';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { FairCategory } from '@fairs/entities/fairCategory.entity';

dotenvConfig({ path: '.env' });

const config: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  
  // 🔧 CONFIGURACIÓN CRÍTICA PARA MEMORIA
  synchronize: process.env.NODE_ENV === 'development', // Solo en desarrollo
  logging: process.env.SQL_LOGGING === 'true' ? 'all' : ['error'], // Logging configurable
  
  // 🚀 CONNECTION POOLING - CRÍTICO
  extra: {
    max: Number(process.env.DB_MAX_CONNECTIONS) || 20, // Máximo conexiones simultáneas
    min: Number(process.env.DB_MIN_CONNECTIONS) || 5,  // Mínimo conexiones activas
    connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT) || 30000,
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT) || 30000,
    allowExitOnIdle: true, // Permitir cerrar proceso cuando no hay conexiones
  },
  
  // 🔄 CONFIGURACIÓN DE CACHE
  cache: {
    duration: Number(process.env.CACHE_DURATION) || 30000, // Cache configurable
    type: (process.env.CACHE_TYPE as 'database' | 'redis' | 'ioredis' | 'ioredis/cluster') || 'database', // Tipo de cache configurable
  },
  
  // 📊 LÍMITES DE QUERY
  maxQueryExecutionTime: 30000, // 30 segundos máximo por query
  
  entities: [
    Fair,
    UserFairRegistration,
    SellerFairRegistration,
    User,
    Product,
    Seller,
    PaymentTransaction,
    Category,
    ProductRequest,
    BuyerCapacity,
    FairDay,
    FairCategory,
  ],
  
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  
  // 🧹 CONFIGURACIÓN DE CLEANUP
  dropSchema: false, // NUNCA en producción
  
  // 🔧 CONFIGURACIONES ADICIONALES DE RECONEXIÓN
  // acquireTimeout no existe para PostgreSQL, usamos connectionTimeoutMillis en extra
  // timeout tampoco existe, usamos los timeouts en extra
  
  // 📈 CONFIGURACIÓN DE PERFORMANCE
  installExtensions: false // No instalar extensiones automáticamente
  // Máximo 3 intentos de reconexión
 
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);