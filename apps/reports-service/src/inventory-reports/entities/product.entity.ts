// apps/reports-service/src/inventory-reports/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InventoryStock } from './inventory-stock.entity';

@Entity('products') // Nombre de la tabla en la BD 'inventory'
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column({ type: 'decimal' })
  price: number;

 @OneToMany(() => InventoryStock, (stock: InventoryStock) => stock.product) // <-- Añade el tipo aquí
  stockItems: InventoryStock[];
}