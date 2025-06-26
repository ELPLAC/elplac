import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Product } from '../products/entities/products.entity';
import { Fair } from '../fairs/entities/fairs.entity';
import { PaymentTransaction } from '../payment_transaction/paymentTransaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Fair, PaymentTransaction])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}