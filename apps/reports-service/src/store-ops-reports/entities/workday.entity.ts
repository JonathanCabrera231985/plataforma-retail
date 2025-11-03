// apps/reports-service/src/store-ops-reports/entities/workday.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './store.entity';
import { WorkdayStatus } from '../enums/workday-status.enum';

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