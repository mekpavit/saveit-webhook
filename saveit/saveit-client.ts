import { MessageDatabase } from './database';
import { Platform } from './platform';
import { SaveItRequest, RequestStatus } from './saveit-request';
import { SaveItResponse } from './saveit-response';
import { TextMessage, MessageParser } from './message';

export class SaveItClient {

  private _db: MessageDatabase;;
  private _platform: Platform

  constructor(platform: Platform, db: MessageDatabase) {
    this._db = db;
    this._platform = platform;
  }

  public async handleHTTPRequest(req: {headers: Object, body: string}): Promise<boolean> {
    this._platform.validateHTTPRequest(req);
    const saveItRequest: SaveItRequest = await this._platform.parseHTTPRequest(req);
    return await this.handleSaveItRequest(saveItRequest);

  }

  public async handleSaveItRequest(saveItRequest: SaveItRequest): Promise<boolean> {
    const requestStatus = saveItRequest.getRequestStatus();
    if (requestStatus === RequestStatus.Add) {
      try {
        await this._db.addMessage(saveItRequest.getMessage(), saveItRequest.getUserId());
        const saveItResponse = new SaveItResponse();
        saveItResponse.addMessage(new TextMessage('ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ`'));
        saveItResponse.setPlatformCustomPayload(saveItRequest.getPlatformCustomPayload());
        this._platform.sendMessages(saveItResponse);
      } catch(err) {
        throw new TypeError(err);
      }
    } else if (requestStatus === RequestStatus.Stop) {
      const saveItResponse = new SaveItResponse();
      saveItResponse.addMessage(new TextMessage('อยากให้ผมจำข้อความพวกนี้ด้วยชื่ออะไรครับ? พิมพ์ `ชื่อ` ตามด้วยชื่อที่ต้องการได้เลยครับ'));
      saveItResponse.setPlatformCustomPayload(saveItRequest.getPlatformCustomPayload());
      this._platform.sendMessages(saveItResponse)
    } else if (requestStatus === RequestStatus.Save) {
      const messageName = saveItRequest.getMessageName();
      const userId = saveItRequest.getUserId()
      const savedMessageName = await this._db.saveMessageName(messageName, userId);
      const saveitResponse = new SaveItResponse();
      saveitResponse.addMessage(new TextMessage('ผมจำข้อความนี้ของพี่แล้วครับ ถ้าอยากให้ผมส่งข้อความให้ พิมพ์ `ขอ` ตามด้วยชื่อข้อความได้เลยครับ! เช่น `ขอ' + savedMessageName + '`'));
      this._platform.sendMessages(saveitResponse);
    } else if (requestStatus === RequestStatus.Recall) {
      const messageName = saveItRequest.getMessageName();
      const userId = saveItRequest.getUserId();
      const messages = await this._db.getMessages(messageName, userId);
      const saveitResponse = new SaveItResponse();
      messages.forEach((msg) => {
        const messageObject = MessageParser.parseObject(msg);
        saveitResponse.addMessage(messageObject);
      })
      this._platform.sendMessages(saveitResponse);
    } else {
      throw new TypeError("No requestStatus provided");
    }
    return true;
  }

}
