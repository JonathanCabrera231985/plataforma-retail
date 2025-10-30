// apps/suppliers-service/src/suppliers/entities/supplier.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('suppliers') // Nombre de la tabla
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  name: string; // Nombre de la empresa proveedora

  @Column({ type: 'varchar', length: 150, name: 'contact_name', nullable: true })
  contactName: string; // Nombre de la persona de contacto

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 13, nullable: true, unique: true })
  ruc: string; // Registro Único de Contribuyente (o RIF, CUIT, etc.)

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Aquí, más adelante, irán las relaciones con
  // Ordenes de Compra (@OneToMany) y Abonos.
}