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
  synchronize: true,
  //dropSchema: true,
  logging: false,
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
  ssl: false, 

  // entities: ['dist/**/*.entity{.ts,.js}'],
  //autoLoadEntities: true,
  migrations: ['dist/src/migrations/*{.ts,.js}'],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
