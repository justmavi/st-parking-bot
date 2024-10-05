import { CallOptions } from '@twilio/dto/call.dto';
import { User } from '@user/entities/user.entity';

export interface Request extends Express.Request {
  user?: User;
  callOptions?: CallOptions;
}
