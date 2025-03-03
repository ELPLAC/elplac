import { Module } from '@nestjs/common';
import { ProductsController } from '@products/controllers/products.controller';
import { ProductsRepository } from '@products/products.repository';
import { ProductsService } from '@products/services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@products/entities/products.entity';
import { Seller } from '@sellers/sellers.entity';
import { FairsService } from '@fairs/fairs.service';
import { Fair } from '@fairs/entities/fairs.entity';
import { FairsRepository } from '@fairs/fairs.repository';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';
import { ProductRequestController } from '@products/controllers/productRequest.controller';
import { ProductRequestService } from '@products/services/productRequest.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SellerRepository } from '@sellers/sellers.repository';
import { ProductRequest } from '@products/entities/productRequest.entity';
import { UsersService } from '@users/users.service';
import { User } from '@users/users.entity';
import { UserRepository } from '@users/users.repository';
import { UserFairRegistration } from '@fairs/entities/userFairRegistration.entity';
import { BuyerCapacity } from '@fairs/entities/buyersCapacity.entity';
import { Category } from '@categories/categories.entity';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { FairCategory } from '@fairs/entities/fairCategory.entity';
import { UserToSellerService } from '@users/changeRole';
import { MercadoPagoModule } from '@payment_transaction/payments.module';

dotenvConfig({ path: '.env' });

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Seller,
      Fair,
      SellerFairRegistration,
      ProductRequest,
      User,
      UserFairRegistration,
      BuyerCapacity,
      Category,
      FairDay,
      FairCategory,
      MercadoPagoModule
    ]),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"FERIAS EL PLAC" <${process.env.EMAIL}>`,
      },
    }),
  ],
  controllers: [ProductsController, ProductRequestController],
  providers: [
    ProductsRepository,
    ProductsService,
    FairsService,
    FairsRepository,
    ProductRequestService,
    SellerRepository,
    UsersService,
    UserRepository,
    UserToSellerService,
  ],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
