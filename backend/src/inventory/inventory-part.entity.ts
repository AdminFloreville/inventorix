// src/inventory/inventory-part.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity()
export class InventoryPart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  serialNumber: string;

  @ManyToOne(() => Inventory, (inventory) => inventory.parts, {
    onDelete: 'CASCADE',
  })
  inventory: Inventory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
