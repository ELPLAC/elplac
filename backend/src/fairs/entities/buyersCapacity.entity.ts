// src/fairs/entities/buyersCapacity.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Fair } from './fairs.entity'; // Importa la entidad Fair
import { Exclude } from 'class-transformer';

@Entity({ name: 'buyer_capacity' })
export class BuyerCapacity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  // Si necesitas almacenar el ID de la feria directamente como FK
  @Column()
  fairId: string;

  @Column()
  hour: string;

  @Column({ default: 10 })
  capacity: number;

  @Column({ type: 'date' }) // Si la capacidad es por fecha
  date: Date;

  // ¡AÑADE ESTAS LÍNEAS PARA RELACIONAR CON Fair!
  @ManyToOne(() => Fair, fair => fair.buyerCapacities)
  @Exclude() // Opcional: para excluirlo de las respuestas JSON por defecto
  fair: Fair;

  // Si buyerCapacity también necesita ser relacionada con FairDay,
  // tendríamos que revisar la lógica y cómo se usa, pero para el error actual,
  // esta es la corrección directa. Si es por FairDay, la columna sería fairDayId.
}
