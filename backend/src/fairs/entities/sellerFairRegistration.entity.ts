import { Fair } from '@fairs/entities/fairs.entity';
import { Seller } from '@sellers/sellers.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FairCategory } from '@fairs/entities/fairCategory.entity';

@Entity({ name: 'seller_fair_registration' })
export class SellerFairRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  registrationDate: Date;

  @Column()
  entryFee?: number;

  @Column({ default: false })
  liquidation: boolean;

  @ManyToOne(() => Seller, (seller) => seller.registrations)
  @JoinColumn()
  seller: Seller;

  @ManyToOne(() => Fair, (fair) => fair.sellerRegistrations)
  @JoinColumn()
  fair: Fair;

  @ManyToOne(
    () => FairCategory,
    (fairCategory) => fairCategory.sellerRegistrations,
  )
  @JoinColumn()
  categoryFair: FairCategory;
}
