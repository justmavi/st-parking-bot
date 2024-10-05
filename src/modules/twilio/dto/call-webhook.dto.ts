import { Expose } from 'class-transformer';
import type { CallStatus } from 'twilio/lib/rest/api/v2010/account/call';

export class CallWebhookDTO {
  @Expose({ name: 'CallStatus' })
  public callStatus: CallStatus;

  @Expose({ name: 'CallSid' })
  public callSid: string;

  @Expose({ name: 'SipResponseCode' })
  public sipResponseCode?: number;
}
