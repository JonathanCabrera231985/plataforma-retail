// apps/inventory-service/src/locations/entities/location.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('locations') // Nombre de la tabla
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  name: string; // Ej: "Bodega Central", "Tienda Guayaquil"

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string; // Dirección física (opcional)

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  description: string; // Notas adicionales sobre la ubicación

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Podríamos añadir aquí la relación OneToMany con InventoryStock si quisiéramos
  // @OneToMany(() => InventoryStock, stock => stock.location)
  // stockItems: InventoryStock[];
}