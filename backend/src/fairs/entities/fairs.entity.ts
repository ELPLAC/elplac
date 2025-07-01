import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FairCategory } from './fair-categories.entity';
import { FairProduct } from './fair-products.entity';

@Entity()
export class Fair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @OneToMany(() => FairCategory, (category) => category.fair, {
    cascade: true,
  })
  categories: FairCategory[];

  @OneToMany(() => FairProduct, (product) => product.fair, {
    cascade: true,
  })
  products: FairProduct[];
}
