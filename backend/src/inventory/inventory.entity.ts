import { Camera } from 'src/devices/camera/camera.entity';
import { InventoryPart } from './inventory-part.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string; // Например, "camera", "printer", и т.д.

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  count: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Camera, (camera) => camera.inventory)
  cameras: Camera[];

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => InventoryPart, (part) => part.inventory, { cascade: true })
  parts: InventoryPart[];
}
