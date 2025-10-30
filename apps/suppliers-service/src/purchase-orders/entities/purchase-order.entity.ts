// apps/suppliers-service/src/purchase-orders/entities/purchase-order.entity.ts

import { Supplier } from '../../suppliers/entities/supplier.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany, // 1. Importar OneToMany
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseOrderItem } from '../../purchase-order-items/entities/purchase-order-item.entity'; // 2. Importar

// ... (Enums de PurchaseOrderStatus y PaymentStatus) ...
export enum PurchaseOrderStatus { /* ... */ }
export enum PaymentStatus { /* ... */ }

@Entity('purchase_orders')
export class PurchaseOrder {
  // ... (Columnas id, supplier, status, paymentStatus, totalAmount, amountPaid) ...
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Supplier, { nullable: false, eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  // ... (status, paymentStatus, totalAmount, amountPaid) ...

  // --- 3. Añadir la relación ---
  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, {
    cascade: true, // Guardar ítems al guardar la orden
    eager: true, // Cargar ítems al buscar la orden
  })
  items: PurchaseOrderItem[];
  // -------------------------

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}