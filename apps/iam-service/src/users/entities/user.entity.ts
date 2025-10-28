// apps/iam-service/src/users/entities/user.entity.ts

import { Role } from '../../common/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // Esto le da el nombre 'users' a la tabla en PostgreSQL
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string; // Almacenaremos la contraseña hasheada

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STAFF_TIENDA, // Rol por defecto si no se especifica
  })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}