import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { Injectable } from '@nestjs/common';
import { from, map } from 'rxjs';

@Injectable()
export class AccountService {
  constructor(@InjectRepository(Account) private readonly repository: Repository<Account>) {
  }

  public create(id: number) {
    const cb = this.repository.createQueryBuilder();
    const entity = this.repository.create({ id });

    return from(this.repository.save(entity));
  }
}
