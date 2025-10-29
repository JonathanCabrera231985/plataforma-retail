// apps/inventory-service/src/inventory/entities/inventory-stock.entity.ts

import { Product } from '../../products/entities/product.entity';
// import { Location } from '../../locations/entities/location.entity'; // Descomentaremos esto más tarde
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique, // Para asegurar que solo haya una entrada por producto/ubicación
} from 'typeorm';

@Entity('inventory_stock')
@Unique(['product', 'location']) // Clave única compuesta
export class InventoryStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  // --- Relación con Product ---
  @ManyToOne(() => Product, { nullable: false, eager: true }) // eager opcional
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // --- Relación con Location (La crearemos después) ---
  /*
  @ManyToOne(() => Location, { nullable: false, eager: true }) // eager opcional
  @JoinColumn({ name: 'location_id' })
  location: Location;
  */
  @Column({ type: 'uuid', name: 'location_id' }) // Temporalmente usamos solo el ID
  locationId: string; // Cambiaremos esto por la relación completa

  // --- Columnas de auditoría ---
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}