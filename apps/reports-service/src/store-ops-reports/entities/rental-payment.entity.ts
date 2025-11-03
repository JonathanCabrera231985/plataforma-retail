// apps/reports-service/src/store-ops-reports/entities/rental-payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './store.entity';
import { RentalPaymentStatus } from '../enums/rental-payment-status.enum';

@Entity('rental_payments')
export class RentalPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column({ type: 'enum', enum: RentalPaymentStatus })
  status: RentalPaymentStatus;

  @ManyToOne(() => Store, (store: Store) => store.rentalPayments)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}