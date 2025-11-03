// apps/reports-service/src/store-ops-reports/entities/workday.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './store.entity';

export enum WorkdayStatus {
  PENDING_APPROVAL = 'PENDIENTE_APROBACION',
  OPEN = 'ABIERTA',
  CLOSED = 'CERRADA',
}

@Entity('workdays')
export class Workday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: WorkdayStatus })
  status: WorkdayStatus;

  @Column({ name: 'opened_at' })
  openedAt: Date;

  @ManyToOne(() => Store, (store: Store) => store.workdays)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}