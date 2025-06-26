import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Product } from '../products/entities/products.entity';
import { Fair } from '../fairs/entities/fairs.entity';
import { PaymentTransaction } from '../payment_transaction/paymentTransaction.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Fair)
    private readonly fairRepo: Repository<Fair>,
    @InjectRepository(PaymentTransaction)
    private readonly transactionRepo: Repository<PaymentTransaction>,
  ) {}

  async cleanupOldData(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    await this.productRepo.delete({ createdAt: LessThan(cutoffDate) });
    await this.fairRepo.delete({ createdAt: LessThan(cutoffDate) });
    await this.transactionRepo.delete({ transactionDate: LessThan(cutoffDate) });
  }
}