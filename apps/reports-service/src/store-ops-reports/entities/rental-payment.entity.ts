// apps/reports-service/src/store-ops-reports/entities/rental-payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './store.entity';

export enum RentalPaymentStatus {
  PENDING_APPROVAL = 'PENDIENTE_APROBACION',
  APPROVED = 'APROBADO',
  PAID = 'PAGADO',
}

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

  @ManyToOne(() => Store, (store: Store) => store.rentalPayments) // <-- AÑADE EL TIPO AQUÍ
  @JoinColumn({ name: 'store_id' })
  store: Store;
}