// apps/inventory-service/src/attributes/entities/attribute.entity.ts

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, // 1. Importar OneToMany
} from 'typeorm';

import { AttributeValue } from '../../attribute-values/entities/attribute-value.entity'; // 2. Importar
@Entity('attributes') // Nombre de la tabla
export class Attribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string; // Ej: "Color", "Altura de Taco", "Material"

  // --- 3. Añadir la relación ---
  @OneToMany(() => AttributeValue, (value) => value.attribute, {
    cascade: true, // Guardar valores al guardar el atributo
    eager: true, // Cargar valores automáticamente
  })
  values: AttributeValue[];
  // -------------------------

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}