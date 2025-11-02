// apps/store-operations-service/src/rental-payments/entities/rental-payment.entity.ts

import { Store } from '../../stores/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RentalPaymentStatus } from '../enums/rental-payment-status.enum';

@Entity('rental_payments') // Nombre de la tabla
export class RentalPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relación con Store ---
  @ManyToOne(() => Store, { nullable: false, eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;
  // -------------------------

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Monto del alquiler

  @Column({ type: 'int' })
  month: number; // Mes (1-12)

  @Column({ type: 'int' })
  year: number; // Año (ej. 2025)

  @Column({
    type: 'enum',
    enum: RentalPaymentStatus,
    default: RentalPaymentStatus.PENDING_APPROVAL,
  })
  status: RentalPaymentStatus;

  // --- AÑADE ESTA COLUMNA ---
  @Column({ type: 'text', nullable: true })
  notes: string;
  // -------------------------

  // ID del usuario de "Maria Fernanda" que aprueba el pago
  @Column({ type: 'uuid', name: 'approved_by_mf_user_id', nullable: true })
  approvedByMfUserId: string;

  @Column({ type: 'timestamp', name: 'payment_date', nullable: true })
  paymentDate: Date; // Fecha en que se realizó el pago

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}