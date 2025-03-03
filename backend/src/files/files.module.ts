import { Module } from '@nestjs/common';
import { FileController } from '@files/files.controller';
import { FileService } from '@files/files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/users.entity';
import { UsersService } from '@users/users.service';
import { UserRepository } from '@users/users.repository';
import { Seller } from '@sellers/sellers.entity';
import { CloudinaryConfig } from '@config/cloudinary';
import { UsersModule } from '@users/users.module';
import { Fair } from '@fairs/entities/fairs.entity';
import { UserFairRegistration } from '@fairs/entities/userFairRegistration.entity';
import { BuyerCapacity } from '@fairs/entities/buyersCapacity.entity';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { UserToSellerService } from '@users/changeRole';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Seller, Fair, UserFairRegistration, BuyerCapacity, FairDay]),
    UsersModule,
  ],
  controllers: [FileController],
  providers: [FileService, UsersService, CloudinaryConfig, UserRepository, UserToSellerService],
  exports: [FileService],
})
export class FileModule {}
