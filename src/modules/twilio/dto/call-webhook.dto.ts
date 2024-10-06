import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import type { CallStatus } from 'twilio/lib/rest/api/v2010/account/call';

export class CallWebhookDTO {
  @IsString()
  @Expose({ name: 'CallStatus' })
  public callStatus: CallStatus;

  @IsString()
  @Expose({ name: 'CallSid' })
  public callSid: string;

  @IsNumber()
  @IsOptional()
  @Expose({ name: 'SipResponseCode' })
  public sipResponseCode?: number;
}
