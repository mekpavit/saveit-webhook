import { SaveItRequest } from './saveit-request';
import { SaveItResponse } from './saveit-response';
import * as line from '@line/bot-sdk';

export interface Platform {

  validateHTTPRequest(req: {headers: Object, body: string}): void;
  parseHTTPRequest(req: Object): Promise<SaveItRequest>;
  sendMessages(saveItResponse: SaveItResponse): Promise<boolean>;

}

export class LINEPlatform {

  private _client: line.Client;
  private _channelSecret: string;

  constructor(channelAccessToken: string, channelSecret: string) {
    this._client = new line.Client({channelAccessToken, channelSecret});
    this._channelSecret = channelSecret;
  }

  public parseHTTPRequest(req: {headers: Object, body: string}): Promise<SaveItRequest> {
    const saveItRequest = new SaveItRequest();
    const requestBody: line.WebhookRequestBody = JSON.parse(req.body);

  }

  public validateHTTPRequest(req: {headers: Object, body: string}): void {
    const signature = req.headers["x-line-signature"];
    if (!line.validateSignature(req.body, this._channelSecret, signature)) {
      throw new Error('signature validation failed');
    }
  }

  private _

}