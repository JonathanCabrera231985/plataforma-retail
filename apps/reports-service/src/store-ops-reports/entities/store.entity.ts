// apps/reports-service/src/store-ops-reports/entities/store.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RentalPayment } from './rental-payment.entity';
import { Workday } from './workday.entity';

@Entity('stores') // Nombre de la tabla en la BD 'store_ops'
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'owner_user_id' })
  ownerUserId: string;

 @OneToMany(() => RentalPayment, (payment: RentalPayment) => payment.store) // <-- AÑADE EL TIPO AQUÍ
  rentalPayments: RentalPayment[];

  @OneToMany(() => Workday, (workday: Workday) => workday.store) // <-- AÑADE EL TIPO AQUÍ
  workdays: Workday[];
}