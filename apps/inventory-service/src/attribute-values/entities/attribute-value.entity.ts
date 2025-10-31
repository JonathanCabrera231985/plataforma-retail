// apps/inventory-service/src/attribute-values/entities/attribute-value.entity.ts

import { Attribute } from '../../attributes/entities/attribute.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('attribute_values') // Nombre de la tabla
export class AttributeValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  value: string; // Ej: "Rojo", "5cm", "Cuero"

  // --- Relación con Attribute ---
  // Muchos valores pertenecen a Un atributo
  @ManyToOne(() => Attribute, (attribute) => attribute.values, {
    nullable: false,
    onDelete: 'CASCADE', // Si se borra el Atributo, se borran sus valores
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: Attribute;
}