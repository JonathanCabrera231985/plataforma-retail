// apps/inventory-service/src/products/entities/product.entity.ts

import { Category } from '../../categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products') // Nombre de la tabla en PostgreSQL
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sku: string; // Stock Keeping Unit

  // --- Relación con Category ---
  @ManyToOne(() => Category, (category) => category.id, {
    eager: true, // Carga automáticamente la categoría al buscar un producto
    nullable: false, // Un producto debe tener una categoría
  })
  @JoinColumn({ name: 'category_id' }) // Nombre de la columna de clave foránea
  category: Category;
  // -----------------------------

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}