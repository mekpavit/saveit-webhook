import { Readable } from 'stream'
import { Storage } from './storage'

export enum MessageType {TEXT, IMAGE}

export interface Message {};

export class TextMessage implements Message {

  private _type: MessageType = MessageType.TEXT;
  private _text: string;

  constructor(text: string) {
    this._text = text;
  }

  public toJSON(): Object {
    return {
      "type": this._type,
      "text": this._text
    }
  }

}

export class ImageMessage implements Message {

  private _type: MessageType = MessageType.IMAGE;
  private _imageUrl: string;

  constructor(imageUrl: string) {
    this._imageUrl = imageUrl;
  }

  public static async fromReadable(readable: Readable, imageId: string, storage: Storage): Promise<ImageMessage> {
    const fileName = imageId + '.jpeg'
    const imageUrl = await storage.uploadAndGetUrl(fileName, readable);
    return new ImageMessage(imageUrl);
  }

}
