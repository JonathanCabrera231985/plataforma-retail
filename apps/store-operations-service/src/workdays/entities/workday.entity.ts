// apps/store-operations-service/src/workdays/entities/workday.entity.ts

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
import { WorkdayStatus } from '../enums/workday-status.enum';

@Entity('workdays') // Nombre de la tabla
export class Workday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relación con Store ---
  @ManyToOne(() => Store, { nullable: false, eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;
  // -------------------------

  @Column({
    type: 'enum',
    enum: WorkdayStatus,
    default: WorkdayStatus.PENDING_APPROVAL,
  })
  status: WorkdayStatus;

  @Column({ type: 'uuid', name: 'opened_by_user_id' })
  openedByUserId: string; // ID del Staff-Tienda

  @Column({ type: 'timestamp', name: 'opened_at', default: () => 'CURRENT_TIMESTAMP' })
  openedAt: Date;

  @Column({ type: 'uuid', name: 'closed_by_user_id', nullable: true })
  closedByUserId: string;

  @Column({ type: 'timestamp', name: 'closed_at', nullable: true })
  closedAt: Date;

  @Column({ type: 'uuid', name: 'approved_by_owner_id', nullable: true })
  approvedByOwnerId: string; // ID del Dueño-Tienda que aprueba

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}