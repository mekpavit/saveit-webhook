export enum MessageType {Text = "text", Image = "image"}

export interface Message {
  toJSON(): Object;
  equals(that: Object): boolean;
};

export class TextMessage implements Message {

  private _type: MessageType = MessageType.Text;
  private _text: string;

  constructor(text: string) {
    this._text = text;
  }

  public static fromJSON(JSON: {type: string, text: string}): Message {
    if (JSON.type !== 'text') {
      throw new Error('Object must be {"type": "text", "text": string}')
    }
    const message = new TextMessage(JSON.text);
    return message;
  }

  public toJSON(): Object {
    return {
      "type": "text",
      "text": this._text
    }
  }

  public equals(y: Object) {
    if (y == null) { return false; }
    if (this === y) { return true; }
    if (typeof(this) !== typeof(y)) { return false; }
    const that = <TextMessage> y;
    return this._text === that._text;
  }

}

export class ImageMessage implements Message {

  private _type: MessageType = MessageType.Image;
  private _imageUrl: string;

  constructor(imageUrl: string) {
    this._imageUrl = imageUrl;
  }

  public static fromJSON(JSON: {type: string, imageUrl: string}): Message {
    if (JSON.type !== 'image') { throw new Error('Object must be {"type": "image", "imageUrl": string}'); }
    return new ImageMessage(JSON.imageUrl);
  }

  public toJSON(): Object {
    return {
      "type": "image",
      "imageUrl": this._imageUrl
    }
  }

  public equals(y: Object) {
    if (y == null) { return false; }
    if (this === y) { return true; }
    if (typeof(this) !== typeof(y)) { return false; }
    const that = <ImageMessage> y;
    return this._imageUrl === that._imageUrl;
  }

}

export class MessageParser {

  public static parseObject(message: Object): Message {
    if (message == null) { throw new Error('Expect valid message JSON object but `null` was given'); }
    if (!('type' in message)) { throw new Error('Expect `type` attribute in the input object'); }
    const messageJSON: {type: string} = <{type: string}> message;
    if (messageJSON.type == 'text') {
      const textMessageJSON: {type: string, text: string} = <{type: string, text: string}> messageJSON;
      return TextMessage.fromJSON(textMessageJSON);
    }
    if (messageJSON.type == 'image') {
      const imageMessageJSON: {type: string, imageUrl: string} = <{type: string, imageUrl: string}> messageJSON;
      return ImageMessage.fromJSON(imageMessageJSON);
    }
    throw new Error('The input object does not match any message type');
  }

}