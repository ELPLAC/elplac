import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'buyer_capacity' })
export class BuyerCapacity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  hour: string;

  @Column({ default: 10 })
  capacity: number;

  @ManyToOne(() => FairDay, fairDay => fairDay.buyerCapacities)
  @Exclude()
  fairDay: FairDay;
}
