// apps/store-operations-service/src/stores/entities/store.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm';
import { Workday } from '../../workdays/entities/workday.entity';
import { AccessLog } from '../../access-logs/entities/access-log.entity';

@Entity('stores') // Nombre de la tabla
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  name: string; // Ej: "Tienda San Marino"

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  // ID del usuario (del iam-service) que es dueño de esta tienda
  @Column({ type: 'uuid', name: 'owner_user_id', unique: true })
  ownerUserId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Aquí irán las relaciones @OneToMany con Jornadas, Pagos de Alquiler, etc.
  // ...
 // Añadir esto:
  @OneToMany(() => Workday, (workday) => workday.store)
  workdays: Workday[];
  // Añadir esto:
  @OneToMany(() => AccessLog, (log) => log.store)
  accessLogs: AccessLog[];
}