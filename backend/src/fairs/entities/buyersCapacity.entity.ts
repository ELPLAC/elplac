// src/fairs/entities/buyersCapacity.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FairDay } from '@fairs/entities/fairDay.entity'; // Asegúrate de que esta importación sea correcta
import { Exclude } from 'class-transformer';

@Entity({ name: 'buyer_capacity' })
export class BuyerCapacity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  hour: string;

  @Column({ default: 10 })
  capacity: number;

  @Column({ type: 'date' })
  date: Date; // Asumo que `date` estaba aquí, si no, puedes añadirla o ajustarla.

  // ¡ESTA ES LA RELACIÓN CORRECTA A FairDay!
  @ManyToOne(() => FairDay, fairDay => fairDay.buyerCapacities)
  @Exclude() // Mantén Exclude si lo necesitas
  fairDay: FairDay; // Propiedad fairDay para la relación
}