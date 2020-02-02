import { Message } from './message'

export class SaveItResponse {

  private _messages: Array<Message>;
  private _platformCustomPayload: Object;

  constructor() {
    this._messages = [];
  }

  public addMessage(message: Message): void {
    this._messages.push(message);
  }

  public getMessages(): Array<Message> {
    return this._messages;
  }

  public setPlatformCustomPayload(payload: Object): void {
    this._platformCustomPayload = payload;
  }

  public getPlatformCustomPayload(): Object {
    return this._platformCustomPayload;
  }

}