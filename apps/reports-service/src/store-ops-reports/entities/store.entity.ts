// apps/reports-service/src/store-ops-reports/entities/store.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RentalPayment } from './rental-payment.entity';
import { Workday } from './workday.entity';
import { AccessLog } from './access-log.entity'; // 1. IMPORTAR AccessLog

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'owner_user_id' })
  ownerUserId: string;

  @OneToMany(() => RentalPayment, (payment: RentalPayment) => payment.store)
  rentalPayments: RentalPayment[];

  @OneToMany(() => Workday, (workday: Workday) => workday.store)
  workdays: Workday[];

  // --- 2. AÑADIR ESTA RELACIÓN ---
  @OneToMany(() => AccessLog, (log: AccessLog) => log.store)
  accessLogs: AccessLog[];
  // -----------------------------
}