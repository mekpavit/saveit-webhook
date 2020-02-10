import { LINEPlatform, SaveItRequest, RequestStatus, Storage, Message, TextMessage, ImageMessage } from './../../saveit';
import { Readable } from 'stream';

class StubStorage implements Storage {

  private _fileName: string;

  constructor(fileName: string) {
    this._fileName = fileName;
  }

  public uploadAndGetUrl(fileName: string, readable: Readable): Promise<string> {
    return new Promise<string>((resolve, reject) => resolve(this._fileName));
  }

  public getSignedUrlFromFileName(fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => resolve(this._fileName));
  }

}


describe('LINEPlatform', () => {

  describe('parseHTTPRequest', () => {

    test('it should parse userId', async () => {
      const req = {
        'headers': {
          'x-line-signature': 'abcde'
        },
        'body': '{"events": [{"replyToken": "abcd1234", "source": {"userId": "12345"}, "type": "message", "message": {"type": "text", "text": "please remember"}}]}'
      };

      const storage = new StubStorage('imageid.jpeg');
      const platform = new LINEPlatform("abc", "abc", storage);
      const saveItRequest: SaveItRequest  = await platform.parseHTTPRequest(req);
      expect(saveItRequest.getUserId()).toEqual('12345');
    })

    test('it should parse replyToken', async () => {
      const req = {
        'headers': {
          'x-line-signature': 'abcde'
        },
        'body': '{"events": [{"replyToken": "abcd1234", "source": {"userId": "12345"}, "type": "message", "message": {"type": "text", "text": "please remember"}}]}'
      };

      const storage = new StubStorage('imageid.jpeg');
      const platform = new LINEPlatform("abc", "abc", storage);
      const saveItRequest: SaveItRequest  = await platform.parseHTTPRequest(req);
      expect(saveItRequest.getPlatformCustomPayload()).toEqual({"replyToken": "abcd1234"});
    })

    test('when there is no word `พอ`, `ชื่อ`, `ขอ` in the req, it should parse RequestStatus.ADD', async () => {

      const req = {
        'headers': {
          'x-line-signature': 'abcde'
        },
        'body': '{"events": [{"replyToken": "abcd1234", "source": {"userId": "12345"}, "type": "message", "message": {"type": "text", "text": "please remember"}}]}'
      };

      const storage = new StubStorage('imageid.jpeg');
      const platform = new LINEPlatform("abc", "abc", storage);
      const saveItRequest: SaveItRequest  = await platform.parseHTTPRequest(req);
      expect(saveItRequest.getRequestStatus()).toEqual(RequestStatus.Add);
      
    })

    test('when there is a word `พอ` in the req, it should parse RequestStatus.STOP', async () => {

      const req = {
        'headers': {
          'x-line-signature': 'abcde'
        },
        'body': '{"events": [{"replyToken": "abcd1234", "source": {"userId": "12345"}, "type": "message", "message": {"type": "text", "text": "พอ"}}]}'
      };

      const storage = new StubStorage('imageid.jpeg');
      const platform = new LINEPlatform("abc", "abc", storage);
      const saveItRequest: SaveItRequest  = await platform.parseHTTPRequest(req);
      expect(saveItRequest.getRequestStatus()).toEqual(RequestStatus.Stop);

    })

    test('when there is a word `ชื่อ` in the req, it should parse RequestStatus.Save', async () => {

      const req = {
        'headers': {
          'x-line-signature': 'abcde'
        },
        'body': '{"events": [{"replyToken": "abcd1234", "source": {"userId": "12345"}, "type": "message", "message": {"type": "text", "text": "ชื่อข้อความหนึ่ง"}}]}'
      };

      const storage = new StubStorage('imageid.jpeg');
      const platform = new LINEPlatform("abc", "abc", storage);
      const saveItRequest: SaveItRequest  = await platform.parseHTTPRequest(req);
      expect(saveItRequest.getRequestStatus()).toEqual(RequestStatus.Save);

    })

    test('when there is a word `ชื่อ` in the req, it should parse messageName', async () => {

      const req = {
        'headers': {
          'x-line-signature': 'abcde'
        },
        'body': '{"events": [{"replyToken": "abcd1234", "source": {"userId": "12345"}, "type": "message", "message": {"type": "text", "text": "ชื่อข้อความหนึ่ง"}}]}'
      };

      const storage = new StubStorage('imageid.jpeg');
      const platform = new LINEPlatform("abc", "abc", storage);
      const saveItRequest: SaveItRequest  = await platform.parseHTTPRequest(req);
      expect(saveItRequest.getMessageName()).toEqual('ข้อความหนึ่ง');

    })

    test('when there is a word `ขอ` in the req, it should parse RequestStatus.Recall', async () => {

      const req = {
        'headers': {
          'x-line-signature': 'abcde'
        },
        'body': '{"events": [{"replyToken": "abcd1234", "source": {"userId": "12345"}, "type": "message", "message": {"type": "text", "text": "ขอข้อความหนึ่ง"}}]}'
      };

      const storage = new StubStorage('imageid.jpeg');
      const platform = new LINEPlatform("abc", "abc", storage);
      const saveItRequest: SaveItRequest  = await platform.parseHTTPRequest(req);
      expect(saveItRequest.getRequestStatus()).toEqual(RequestStatus.Recall);

    })

    test('when there is a word `ขอ` in the req, it should parse messageName', async () => {

      const req = {
        'headers': {
          'x-line-signature': 'abcde'
        },
        'body': '{"events": [{"replyToken": "abcd1234", "source": {"userId": "12345"}, "type": "message", "message": {"type": "text", "text": "ชื่อข้อความหนึ่ง"}}]}'
      };

      const storage = new StubStorage('imageid.jpeg');
      const platform = new LINEPlatform("abc", "abc", storage);
      const saveItRequest: SaveItRequest  = await platform.parseHTTPRequest(req);
      expect(saveItRequest.getMessageName()).toEqual('ข้อความหนึ่ง');

    })

    test('when there are more than one event, it should keep all messages', async () => {

      const req = {
        'headers': {
          'x-line-signature': 'abcde'
        },
        'body': '{"events": [{"replyToken": "abcd1234", "source": {"userId": "12345"}, "type": "message", "message": {"type": "text", "text": "remember 1"}}, {"replyToken": "abcd1234", "source": {"userId": "12345"}, "type": "message", "message": {"type": "text", "text": "remember 2"}}]}'
      };

      const expectedMessages = [
        new TextMessage('remember 1'), new TextMessage('remember 2')
      ]

      const storage = new StubStorage('imageid.jpeg');
      const platform = new LINEPlatform("abc", "abc", storage);
      const saveItRequest: SaveItRequest  = await platform.parseHTTPRequest(req);
      expect(saveItRequest.getMessage()).toStrictEqual<Array<Message>>(expectedMessages);

    })

  })

})