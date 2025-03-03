import { Module } from '@nestjs/common';
import { FairsController } from '@fairs/fairs.controller';
import { FairsService } from '@fairs/fairs.service';
import { FairsRepository } from '@fairs/fairs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fair } from '@fairs/entities/fairs.entity';
import { BuyerCapacity } from '@fairs/entities/buyersCapacity.entity';
import { Category } from '@categories/categories.entity';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { FairCategory } from '@fairs/entities/fairCategory.entity';
import { User } from '@users/users.entity';
import { Seller } from '@sellers/sellers.entity';
import { Product } from '@products/entities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fair, BuyerCapacity, Category, FairDay, FairCategory, User, Seller, Product])],
  controllers: [FairsController],
  providers: [FairsService, FairsRepository]
})
export class FairsModule {}
