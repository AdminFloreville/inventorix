// src/devices/printer/printer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Inventory } from '../../inventory/inventory.entity';

@Entity()
export class Printer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'timestamp', nullable: true })
  offlineSince: Date;

  @ManyToOne(() => Inventory, (inv) => inv.id, { eager: true })
  inventory: Inventory;
}
