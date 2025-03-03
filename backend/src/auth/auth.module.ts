import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { config as dotenvConfig } from 'dotenv';

import { User } from '@users/users.entity';
import { Seller } from '@sellers/sellers.entity';
import { UserFairRegistration } from '@fairs/entities/userFairRegistration.entity';
import { Fair } from '@fairs/entities/fairs.entity';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';
import { BuyerCapacity } from '@fairs/entities/buyersCapacity.entity';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { Category } from '@categories/categories.entity';
import { FairCategory } from '@fairs/entities/fairCategory.entity';
import { Product } from '@products/entities/products.entity';
import { ProductRequest } from '@products/entities/productRequest.entity';

import { UserRepository } from '@users/users.repository';
import { SellerRepository } from '@sellers/sellers.repository';
import { UsersService } from '@users/users.service';
import { FairsService } from '@fairs/fairs.service';
import { FairsRepository } from '@fairs/fairs.repository';
import { UserToSellerService } from '@users/changeRole';
import { ProductsRepository } from '@products/products.repository';
import { ProductsModule } from '@products/products.module';

import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { IsDniValidConstraint } from '@auth/auth.validator';

dotenvConfig({ path: '.env' });

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, Seller, UserFairRegistration, Fair, SellerFairRegistration,
      BuyerCapacity, FairDay, Category, FairCategory, Product, ProductRequest,
      ProductsRepository,
    ]),
    ProductsModule,
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
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UserRepository,
    SellerRepository,
    FairsService,
    FairsRepository,
    IsDniValidConstraint,
    UserToSellerService,
    ProductsRepository,
  ],
  exports: [AuthService, MailerModule],
})
export class AuthModule {}
