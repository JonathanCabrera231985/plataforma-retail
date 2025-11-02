// apps/store-operations-service/src/access-logs/entities/access-log.entity.ts

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
import { AccessStatus } from '../enums/access-status.enum';

@Entity('access_logs') // Nombre de la tabla
export class AccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relación con Store ---
  @ManyToOne(() => Store, { nullable: false, eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;
  // -------------------------

  // ID del usuario de "Maria Fernanda" que solicita el ingreso
  @Column({ type: 'uuid', name: 'mf_user_id' })
  mfUserId: string;

  @Column({ type: 'text', nullable: true })
  purpose: string; // Motivo de la visita

  @Column({
    type: 'enum',
    enum: AccessStatus,
    default: AccessStatus.PENDING,
  })
  status: AccessStatus;

  // ID del Dueño-Tienda que aprueba o rechaza
  @Column({ type: 'uuid', name: 'approved_by_owner_id', nullable: true })
  approvedByOwnerId: string;

  @Column({ type: 'timestamp', name: 'entry_time', default: () => 'CURRENT_TIMESTAMP' })
  entryTime: Date; // Hora de la solicitud de ingreso

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}