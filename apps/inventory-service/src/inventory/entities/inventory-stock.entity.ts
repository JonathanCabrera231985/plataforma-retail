// apps/inventory-service/src/inventory/entities/inventory-stock.entity.ts

import { Product } from '../../products/entities/product.entity';
import { Location } from '../../locations/entities/location.entity'; // 1. Importar Location
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('inventory_stock')
@Unique(['product', 'location'])
export class InventoryStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @ManyToOne(() => Product, { nullable: false, eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // --- Relación con Location (Actualizada) ---
  @ManyToOne(() => Location, { nullable: false, eager: true }) // 2. Descomentar y asegurar que eager sea true (o quitarlo si prefieres carga manual)
  @JoinColumn({ name: 'location_id' })
  location: Location; // 3. Usar la entidad Location
  // ------------------------------------------

  // 4. Eliminar la columna temporal locationId
  // @Column({ type: 'uuid', name: 'location_id' })
  // locationId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}