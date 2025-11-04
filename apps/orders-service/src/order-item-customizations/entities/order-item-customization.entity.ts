// apps/orders-service/src/order-item-customizations/entities/order-item-customization.entity.ts

import { OrderItem } from '../../order-items/entities/order-item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order_item_customizations')
export class OrderItemCustomization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relación con OrderItem ---
  @ManyToOne(() => OrderItem, (item) => item.customizations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItem;
  // -----------------------------

  // IDs del inventory-service (Atributo y Valor)
  // Ej. attributeId (Color), valueId (Rojo)

  @Column({ type: 'uuid', name: 'attribute_id' })
  attributeId: string;

  @Column({ type: 'uuid', name: 'value_id' })
  valueId: string;

  // (Opcional) Guardamos los nombres para reportes fáciles
  @Column({ type: 'varchar', name: 'attribute_name', nullable: true })
  attributeName: string | null; // <-- AÑADE | null

  @Column({ type: 'varchar', name: 'value_name', nullable: true })
  valueName: string | null; // <-- AÑADE | null
}