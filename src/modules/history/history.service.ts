import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map } from 'rxjs';
import {
  Repository,
} from 'typeorm';
import { History } from './entities/history.entity';
import { Account } from '@account/entities/account.entity';

@Injectable()
export class HistoryService {
  constructor(@InjectRepository(History) private readonly repository: Repository<History>) {
  }

  public findBySid(sid: string) {
    return from(
      this.repository.find({
        where: { sid },
        relations: { account: true },
      }),
    ).pipe(map(([result]) => result));
  }

  public create(account: Account, gateId: number) {
    const entity = this.repository.create({ accountId: account.id, gateId });
    return from(this.repository.save(entity));
  }

  public update(id: number, state: Partial<History>) {
    return from(this.repository.update(id, state));
  }
}
