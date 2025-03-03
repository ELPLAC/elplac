import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Category } from '@categories/categories.entity';
import { Fair } from '@fairs/entities/fairs.entity';
import { Product } from '@products/entities/products.entity';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';

@Entity({ name: 'fair_category' })
export class FairCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  maxProductsSeller: number;

  @Column()
  minProductsSeller: number;

  @Column()
  maxSellers: number;

  @Column()
  maxProducts: number;

  @ManyToOne(() => Category, (category) => category.fairCategories)
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Fair, (fair) => fair.fairCategories)
  fair: Fair;

  @OneToMany(() => Product, (products) => products.fairCategory)
  @JoinColumn()
  products: Product[];

  @OneToMany(
    () => SellerFairRegistration,
    (sellerFairRegistration) => sellerFairRegistration.categoryFair,
  )
  sellerRegistrations: SellerFairRegistration[];
}
