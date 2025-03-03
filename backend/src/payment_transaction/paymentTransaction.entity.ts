import { User } from '@users/users.entity';
import { Fair } from '@fairs/entities/fairs.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class PaymentTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  transactionDate: Date;

  @Column()
  transactionType: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Fair, (fair) => fair.transactions)
  @JoinColumn()
  fair: Fair;
}
