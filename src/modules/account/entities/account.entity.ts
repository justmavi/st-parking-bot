import { AppBaseEntity } from '@common/base/entity.base';
import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Account extends AppBaseEntity {
  @PrimaryColumn('bigint')
  public id: number;

  @Column()
  public name: string;
}
