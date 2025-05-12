// src/history/history.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: 'create' | 'update' | 'delete';

  @Column()
  entity: string;

  @Column()
  entityId: number;

  @Column('jsonb')
  payload: any;

  @CreateDateColumn()
  timestamp: Date;
}
