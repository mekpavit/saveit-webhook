import { Message } from './message'

export class SaveItRequest {

  private _userId: string;
  private _messages: Array<Message>;
  private _messageName: string;
  private _requestStatus: RequestStatus;
  private _platformCustomPayload: Object;

  constructor() {
    this._messages = [];
  }

  public addMessage(message: Message) {
    this._messages.push(message);
  }

  public getMessage(): Array<Message> {
    return this._messages;
  }

  public setUserId(userId: string): void {
    this._userId = userId
  }

  public getUserId(): string {
    return this._userId;
  }

  public setMessageName(messageName: string): void {
    this._messageName = messageName;
  }

  public getMessageName(): string {
    return this._messageName;
  }

  public setRequestStatus(requestStatus: RequestStatus): void {
    this._requestStatus = requestStatus;
  }
  
  public getRequestStatus(): RequestStatus {
    return this._requestStatus;
  }

  public setPlatformCustomPayload(payload: Object): void {
    this._platformCustomPayload = payload;
  }

  public getPlatformCustomPayload(): Object {
    return this._platformCustomPayload;
  }

}

export enum RequestStatus {Add, Stop, Save, Recall}