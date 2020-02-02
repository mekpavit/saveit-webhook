import { MessageDatabase } from './database';
import { Platform } from './platform';
import { SaveItRequest, RequestStatus } from './saveit-request';
import { SaveItResponse } from './saveit-response';
import { TextMessage } from './message';

export class SaveItClient {

  private _db: MessageDatabase;;
  private _platform: Platform

  constructor(platform: Platform, db: MessageDatabase) {
    this._db = db;
    this._platform = platform;
  }

  public async handleHTTPRequest(req: Object): Promise<boolean> {

    const saveItRequest: SaveItRequest = await this._platform.parseRequest(req);
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
      // do stop
    } else if (requestStatus === RequestStatus.Save) {
      // do save
    } else if (requestStatus === RequestStatus.Recall) {
      // do recall
    } else {
      throw new TypeError("No requestStatus provided");
    }
    return true;
  }

}
