import { ApiHideProperty } from '@nestjs/swagger';
import { Product } from '@products/entities/products.entity';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';
import { User } from '@users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ProductRequest } from '@products/entities/productRequest.entity';
import { SellerStatus } from '@sellers/sellers.enum';

@Entity({ name: 'sellers' })
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  @ApiHideProperty()
  id: string = uuid();

  @Column()
  social_media?: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  sku: string;

  @OneToOne(() => User, (user) => user.seller)
  user: User;

  @Column({default: SellerStatus.NO_ACTIVE})
  status: SellerStatus;

  @OneToMany(() => Product, (product) => product.seller)
  @JoinColumn()
  products: Product[];

  @OneToMany(
    () => SellerFairRegistration,
    (registration) => registration.seller,
  )
  registrations: SellerFairRegistration[];

  @OneToMany(() => ProductRequest, (productRequests) => productRequests.seller)
  @JoinColumn()
  productRequests: ProductRequest;
}
