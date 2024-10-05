import { AppBaseEntity } from '@common/base/entity.base';
import {
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Account extends AppBaseEntity {
  @PrimaryColumn('bigint')
  public id: number;
}
