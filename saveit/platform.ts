import { SaveItRequest, RequestStatus } from './saveit-request';
import { SaveItResponse } from './saveit-response';
import * as line from '@line/bot-sdk';
import { Message, TextMessage, ImageMessage } from './message';
import { Storage } from './storage';
import sharp from 'sharp';
import Axios from 'axios';
import { Readable } from 'stream';

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
    return new Promise<SaveItRequest>(async (resolve, reject) => {
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

        for (const event of requestBody.events) {
          if (event.type === 'message') {
            const messageEvent = <line.MessageEvent> event;
            const message = messageEvent.message;
            if (message.type === 'text') {
              saveItRequest.addMessage({type: 'text', text: message.text});
            }
            if (message.type === 'image') {
              const readableImage = await this._client.getMessageContent(message.id);
              const imageUrl = await this._storage.uploadAndGetUrl(message.id + '.jpeg', readableImage);
              saveItRequest.addMessage({ type: 'image', imageUrl: imageUrl });
            }

          }
        }
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
      const saveItMessages = saveItResponse.getMessages();
      for (const msg of saveItMessages) {
        if (msg.type === 'text') {
          messages.push(<line.TextMessage> {type: 'text', text: msg.text});
        }
        if (msg.type === 'image') {
          const publicImageUrl = await this._storage.getSignedUrlFromFileName(msg.imageUrl);
          const previewImageMaker = sharp().resize(240, 240);
          const imageStream = await Axios({
            url: publicImageUrl,
            method: 'GET',
            responseType: 'stream'
          })
          const previewImage = await imageStream.data.pipe(previewImageMaker);
          const previewImageUrl = await this._storage.uploadAndGetUrl(msg.imageUrl + '_preview.jpeg', previewImage);
          const publicPreviewImageUrl = await this._storage.getSignedUrlFromFileName(previewImageUrl);
          console.log('real: ', publicImageUrl)
          console.log('preview: ', publicPreviewImageUrl)
          messages.push(<line.ImageMessage> {type: 'image', originalContentUrl: publicImageUrl, previewImageUrl: publicPreviewImageUrl})
        }
      }
      const payload = <{replyToken: string}> saveItResponse.getPlatformCustomPayload()
      const replyToken = payload['replyToken'];
      const result = await this._client.replyMessage(replyToken, messages)
      resolve(true)
    })

  }

}