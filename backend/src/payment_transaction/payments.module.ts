import { Module } from '@nestjs/common';
import { PaymentsService } from '@payment_transaction/payments.service';
import { PaymentsController } from '@payment_transaction/payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from '@payment_transaction/paymentTransaction.entity';
import { Fair } from '@fairs/entities/fairs.entity';
import { User } from '@users/users.entity';
import { UserFairRegistration } from '@fairs/entities/userFairRegistration.entity';
import { UsersService } from '@users/users.service';
import { UserRepository } from '@users/users.repository';
import { BuyerCapacity } from '@fairs/entities/buyersCapacity.entity';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { SellerService } from '@sellers/seller.service';
import { SellerRepository } from '@sellers/sellers.repository';
import { FairsRepository } from '@fairs/fairs.repository';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';
import { Category } from '@categories/categories.entity';
import { Seller } from '@sellers/sellers.entity';
import { FairCategory } from '@fairs/entities/fairCategory.entity';
import { UserToSellerService } from '@users/changeRole';
import { ProductsRepository } from '@products/products.repository';
import { Product } from '@products/entities/products.entity';
import { ProductRequestService } from '@products/services/productRequest.service';
import { ProductRequest } from '@products/entities/productRequest.entity';
import { ProductsService } from '@products/services/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentTransaction,
      User,
      Fair,
      UserFairRegistration,
      BuyerCapacity,
      FairDay,
      Seller,
      Fair,
      SellerFairRegistration,
      Category,
      FairCategory,
      Product,
      ProductRequest
    ]),
  ],
  providers: [
    PaymentsService,
    UsersService,
    UserRepository,
    SellerService,
    SellerRepository,
    FairsRepository,
    UserToSellerService,
    ProductsRepository,
    ProductRequestService,
    ProductsService
  ],
  controllers: [PaymentsController],
})
export class MercadoPagoModule {}
