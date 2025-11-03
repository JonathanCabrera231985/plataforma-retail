// apps/reports-service/src/store-ops-reports/entities/access-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './store.entity';
import { AccessStatus } from '../enums/access-status.enum';

@Entity('access_logs')
export class AccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Store, (store: Store) => store.accessLogs)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'mf_user_id' })
  mfUserId: string;

  @Column({ type: 'enum', enum: AccessStatus })
  status: AccessStatus;
}