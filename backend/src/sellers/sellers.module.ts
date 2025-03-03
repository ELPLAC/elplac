import { Module } from '@nestjs/common';
import { User } from '@users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerRepository } from '@sellers/sellers.repository';
import { Seller } from '@sellers/sellers.entity';
import { Product } from '@products/entities/products.entity';
import { Fair } from '@fairs/entities/fairs.entity';
import { UserFairRegistration } from '@fairs/entities/userFairRegistration.entity';
import { FairsRepository } from '@fairs/fairs.repository';
import { UsersService } from '@users/users.service';
import { UserRepository } from '@users/users.repository';
import { FairsService } from '@fairs/fairs.service';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';
import { BuyerCapacity } from '@fairs/entities/buyersCapacity.entity';
import { CategoriesRepository } from '@categories/categories.repository';
import { Category } from '@categories/categories.entity';
import { CategoriesService } from '@categories/categories.service';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { FairCategory } from '@fairs/entities/fairCategory.entity';
import { UserToSellerService } from '@users/changeRole';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Seller,
      Product,
      Fair,
      UserFairRegistration,
      SellerFairRegistration,
      BuyerCapacity,
      Category,
      FairDay,
      FairCategory
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
  controllers: [],
  providers: [SellerRepository, UsersService, FairsRepository, FairsService, UserRepository, CategoriesRepository, CategoriesService, UserToSellerService],
})
export class SellerModule {}
