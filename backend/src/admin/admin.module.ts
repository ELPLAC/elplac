import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Product } from '../products/entities/product.entity';
import { Fair } from '../fairs/entities/fair.entity';
import { Transaction } from '../payment_transaction/entities/transaction.entity';
import { JwtAuthGuard, RolesGuard } from '../auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Fair, Transaction]),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AdminModule {}
