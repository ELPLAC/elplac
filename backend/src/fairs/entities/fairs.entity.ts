import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { UserFairRegistration } from '@fairs/entities/userFairRegistration.entity';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';
import { PaymentTransaction } from '@payment_transaction/paymentTransaction.entity';
import { ProductRequest } from '@products/entities/productRequest.entity';
import { FairCategory } from '@fairs/entities/fairCategory.entity';

@Entity({ name: 'fair' })
export class Fair {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  entryPriceSeller: number;

  @Column({default : true})
  isActive: boolean;

  @Column()
  entryPriceBuyer: number;

  @Column()
  entryDescription: string;

  @OneToMany(() => FairDay, fairDay => fairDay.fair)
  fairDays: FairDay[];

  @OneToMany(() => UserFairRegistration, registrations => registrations.fair)
  userRegistrations: UserFairRegistration[];

  @OneToMany(() => SellerFairRegistration, registrations => registrations.fair)
  sellerRegistrations: SellerFairRegistration[];

  @OneToMany(() => PaymentTransaction, transaction => transaction.fair)
  transactions: PaymentTransaction[];

  @OneToMany(() => ProductRequest, productRequest => productRequest.fair)
  productRequests: ProductRequest[];

  @OneToMany(() => FairCategory, fairCategory => fairCategory.fair)
  fairCategories: FairCategory[] | FairCategory;
}
