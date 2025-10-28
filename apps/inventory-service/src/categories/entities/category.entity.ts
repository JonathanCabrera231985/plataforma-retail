// apps/inventory-service/src/categories/entities/category.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories') // Nombre de la tabla en PostgreSQL
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true, // El nombre de la categoría debe ser único
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true, // La descripción es opcional
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}