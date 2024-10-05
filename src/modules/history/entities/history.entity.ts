import { Account } from '@account/entities/account.entity';
import { AppBaseEntity } from '@common/base/entity.base';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class History extends AppBaseEntity {
  @Column({ unique: true })
  public sid: string;

  @Column('bigint')
  public accountId: number;

  @ManyToOne(() => Account)
  public account?: Account;

  @Column({ default: false })
  public isCanceled: boolean;

  @Column({ nullable: true })
  public cancelationReason?: string;

  @Column({ default: false })
  public isActive: boolean;
}
