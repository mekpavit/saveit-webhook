import { Message } from './message'

class SaveItRequest {

  private _userId: string;
  private _platformName: string;
  private _messages: Array<Message>;
  private _requestStatus: RequestStatus;

  constructor(userId: string, platformName: string) {
    this._userId = userId;
    this._platformName = platformName;
  }

  addMessage(message: Message) {
    this._messages.push(message);
  }
  
  // public getRequestStatus(): RequestStatus {
  //   // do
  // }

}

enum RequestStatus {ADD, STOP, SAVE, RECALL}
