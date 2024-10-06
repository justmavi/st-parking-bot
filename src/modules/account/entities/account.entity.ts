import { AppBaseEntity } from '@common/base/entity.base';
import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryColumn('bigint')
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  public name: string;
}
