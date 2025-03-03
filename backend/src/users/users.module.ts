import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from '@users/users.controller';
import { UsersService } from '@users/users.service';
import { User } from '@users/users.entity';
import { UserRepository } from '@users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerRepository } from '@sellers/sellers.repository';
import { Seller } from '@sellers/sellers.entity';
import { Product } from '@products/entities/products.entity';
import { AuthService } from '@auth/auth.service';
import { requiresAuth } from 'express-openid-connect';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';
import { UserFairRegistration } from '@fairs/entities/userFairRegistration.entity';
import { Fair } from '@fairs/entities/fairs.entity';
import { FairsService } from '@fairs/fairs.service';
import { FairsRepository } from '@fairs/fairs.repository';
import { BuyerCapacity } from '@fairs/entities/buyersCapacity.entity';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { Category } from '@categories/categories.entity';
import { FairCategory } from '@fairs/entities/fairCategory.entity';
import { UserToSellerService } from '@users/changeRole';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Seller, UserFairRegistration, SellerFairRegistration, Fair, Product,
      BuyerCapacity, FairDay, Category, FairsRepository, FairCategory ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, SellerRepository, AuthService, FairsService, FairsRepository, UserToSellerService],
  exports: []
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requiresAuth()).forRoutes('auth/protected');
  }
}
