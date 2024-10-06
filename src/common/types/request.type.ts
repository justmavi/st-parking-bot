import { CallOptions } from '@twilio/dto/call.dto';

export interface Request extends Express.Request {
  callOptions?: CallOptions;
}
