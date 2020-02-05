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
    return new TextMessage(JSON.imageUrl);
  }

  public toJSON(): Object {
    return {
      "type": "image",
      "imageUrl": this._imageUrl
    }
  }

  public equals(y: Object) {
    if (this === y) { return true; }
    if (typeof(this) !== typeof(y)) { return false; }
    const that = <ImageMessage> y;
    return this._imageUrl === that._imageUrl;
  }

}
