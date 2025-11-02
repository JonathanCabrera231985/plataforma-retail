// apps/reports-service/src/suppliers-reports/entities/supplier.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  ruc: string;

  @OneToMany(() => PurchaseOrder, (po: PurchaseOrder) => po.supplier) // <-- AÑADE EL TIPO AQUÍ
  purchaseOrders: PurchaseOrder[];
}