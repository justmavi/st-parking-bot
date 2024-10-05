import { GATES, MY_PHONE_NUMBER } from '@common/constants/app.constants';
import { CallInfo } from '@common/types/call-info-payload.type';
import { HistoryService } from '@history/history.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwilioService } from 'nestjs-twilio';
import { from, mergeMap, of, retry, throwError } from 'rxjs';
import { urlJoin } from 'url-join-ts';
import { CallOptions } from './dto/call.dto';

@Injectable()
export class TwilioServiceWrapper {
  constructor(
    private readonly twilio: TwilioService,
    private readonly config: ConfigService,
    private readonly historyService: HistoryService,
  ) {
  }

  public makeCall(opts: CallOptions) {
    const host = this.config.get('global.host');
    const path = this.config.get('global.staticFilesPath');
    const callStatusCallback = this.config.get('twilio.callStatusCallback');

    const callStatusCallbackUrl = urlJoin(host, callStatusCallback);

    return from(
      this.twilio.client.calls.create({
        from: MY_PHONE_NUMBER,
        to: GATES[opts.gateId].number,
        twiml: `<Response><Hangup/></Response>`,
        statusCallbackEvent: ['ringing', 'answered', 'completed'],
        statusCallback: callStatusCallbackUrl,
      }),
    ).pipe(
      mergeMap((result) =>
        this.historyService.create({
          sid: result.sid,
          accountId: opts.accountId,
          gateId: opts.gateId,
          isActive: true,
        }),
      )
    );
  }

  public getCallInfoBySid(sid: string) {
    return from(this.historyService.findBySid(sid)).pipe(
      mergeMap((history) =>
        !history
          ? throwError(() => new Error(`History not found. Sid: ${sid}`))
          : of({
              accountId: history.accountId,
              historyId: history.id,
              gateId: history.gateId
            } as CallInfo),
      ),
      retry({ count: 2, delay: 500 }),
    );
  }
}
