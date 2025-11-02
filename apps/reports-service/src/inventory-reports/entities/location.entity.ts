// apps/reports-service/src/inventory-reports/entities/location.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InventoryStock } from './inventory-stock.entity';

@Entity('locations') // Nombre de la tabla en la BD 'inventory'
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => InventoryStock, (stock: InventoryStock) => stock.location) // <-- Añade el tipo aquí
  stockItems: InventoryStock[];
}