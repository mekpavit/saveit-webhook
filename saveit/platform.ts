import { SaveItRequest, RequestStatus } from './saveit-request';
import { SaveItResponse } from './saveit-response';
import * as line from '@line/bot-sdk';
import { TextMessage, ImageMessage } from './message';
import { Storage } from './storage';
import sharp from 'sharp';

export interface Platform {

  validateHTTPRequest(req: {headers: Object, body: string}): void;
  parseHTTPRequest(req: Object): Promise<SaveItRequest>;
  sendMessages(saveItResponse: SaveItResponse): Promise<boolean>;

}

export class LINEPlatform implements Platform {

  private _client: line.Client;
  private _channelSecret: string;
  private _storage: Storage;

  constructor(channelAccessToken: string, channelSecret: string, storage: Storage) {
    this._client = new line.Client({channelAccessToken, channelSecret});
    this._channelSecret = channelSecret;
    this._storage = storage;
  }

  public parseHTTPRequest(req: {headers: Object, body: Object}): Promise<SaveItRequest> {
    return new Promise<SaveItRequest>((resolve, reject) => {
      const saveItRequest = new SaveItRequest();
      // const requestBody: line.WebhookRequestBody = JSON.parse(req.body);
      const requestBody = <line.WebhookRequestBody> req.body;
      requestBody.events.forEach((event) => {
        if (event.type === 'message') {
          const messageEvent = <line.MessageEvent> event;
          const message = messageEvent.message;
          saveItRequest.setPlatformCustomPayload({'replyToken': messageEvent.replyToken});
          saveItRequest.setUserId(event.source.userId);
          if (message.type === 'text') {
            if (message.text.trim().indexOf('ขอ') === 0) {
              saveItRequest.setRequestStatus(RequestStatus.Recall);
              saveItRequest.setMessageName(message.text.trim().replace('ขอ', ''))
            } else if (message.text.trim().indexOf('ชื่อ') === 0) {
              saveItRequest.setRequestStatus(RequestStatus.Save);
              saveItRequest.setMessageName(message.text.trim().replace('ชื่อ', ''))
            } else if (message.text.trim() === 'พอ') {
              saveItRequest.setRequestStatus(RequestStatus.Stop);
            } else {
              saveItRequest.setRequestStatus(RequestStatus.Add);
            }
          } else {
            saveItRequest.setRequestStatus(RequestStatus.Add);
          }
        }
      })
      if (saveItRequest.getRequestStatus() === RequestStatus.Add) {
        requestBody.events.forEach( async (event) => {
          if (event.type === 'message') {
            const messageEvent = <line.MessageEvent> event;
            const message = messageEvent.message;
            if (message.type === 'text') {
              saveItRequest.addMessage(new TextMessage(message.text));
            }
            if (message.type === 'image') {
              const readableImage = await this._client.getMessageContent(message.id);
              const imageUrl = await this._storage.uploadAndGetUrl(message.id, readableImage);
              saveItRequest.addMessage(new ImageMessage(imageUrl));
            }
          }
        })
      }
      
      resolve(saveItRequest);
    })
    

  }

  public validateHTTPRequest(req: {headers: {"x-line-signature": string}, body: string}): void {
    const signature = req.headers["x-line-signature"];
    if (!line.validateSignature(req.body, this._channelSecret, signature)) {
      throw new Error('signature validation failed');
    }
  }

  public sendMessages(saveItResponse: SaveItResponse): Promise<boolean> {

    return new Promise<boolean>(async (resolve, reject) => {
      const messages = new Array<line.Message>();
      saveItResponse.getMessages().forEach((message) => {
        const messageObject = <{type: string}> message.toJSON();
        if (messageObject['type'] === 'text') {
          messages.push(<line.TextMessage> messageObject)
        }
        if (messageObject['type'] === 'image') {
          // const publicImageUrl = await this._storage.getSignedUrlFromFileName(messageObject['imageUrl']);
          // sharp(publicImageUrl).resize(240, 240).png()
        
        }
      });
      const payload = <{replyToken: string}> saveItResponse.getPlatformCustomPayload()
      const replyToken = payload['replyToken'];
      console.log(messages);
      const result = await this._client.replyMessage(replyToken, messages)
      resolve(true)
    })

  }

}