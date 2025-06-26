import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Fair } from '../fairs/entities/fair.entity';
import { Transaction } from '../payment_transaction/entities/transaction.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Fair)
    private readonly fairRepo: Repository<Fair>,

    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async cleanOldData(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90); // 90 días atrás

    await this.productRepo.delete({
      createdAt: LessThan(cutoffDate),
    });

    await this.fairRepo.delete({
      createdAt: LessThan(cutoffDate),
    });

    await this.transactionRepo.delete({
      createdAt: LessThan(cutoffDate),
    });
  }
}

