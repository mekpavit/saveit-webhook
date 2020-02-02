export enum MessageType {Text = "text", Image = "image"}

export interface Message {
  toJSON(): Object;
};

export class TextMessage implements Message {

  private _type: MessageType = MessageType.Text;
  private _text: string;

  constructor(text: string) {
    this._text = text;
  }

  public toJSON(): Object {
    return {
      "type": "text",
      "text": this._text
    }
  }

}

export class ImageMessage implements Message {

  private _type: MessageType = MessageType.Image;
  private _imageUrl: string;

  constructor(imageUrl: string) {
    this._imageUrl = imageUrl;
  }

  public toJSON(): Object {
    return {
      "type": "image",
      "imageUrl": this._imageUrl
    }
  }

}
