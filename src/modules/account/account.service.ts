import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(@InjectRepository(Account) private readonly repository: Repository<Account>) {
  }

  public create(id: number, name: string) {
    const entity = this.repository.create({ id, name });

    return from(this.repository.save(entity));
  }

  public findOne(id: number) {
    return from(this.repository.findOneBy({ id }));
  }
}
