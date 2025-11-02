// apps/reports-service/src/inventory-reports/entities/inventory-stock.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Location } from './location.entity';

@Entity('inventory_stock') // Nombre de la tabla en la BD 'inventory'
export class InventoryStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product: Product) => product.stockItems) // <-- Añade el tipo aquí
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Location, (location: Location) => location.stockItems) // <-- Añade el tipo aquí
  @JoinColumn({ name: 'location_id' })
  location: Location;
}