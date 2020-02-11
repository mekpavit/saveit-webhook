import { SaveItClient, SaveItRequest, SaveItResponse, Platform, MessageDatabase, Message, RequestStatus } from './../../saveit';

class MockPlatform implements Platform {

  public saveItReponse: SaveItResponse;
  public parseHTTPRequest(): Promise<SaveItRequest> {return new Promise((resolve, reject) => {resolve();})}
  public validateHTTPRequest(): Promise<void> {return new Promise((resolve, reject) => resolve())}
  public sendMessages(saveItReponse: SaveItResponse): Promise<boolean> {
    this.saveItReponse = saveItReponse;
    return new Promise((resolve, reject) => {resolve(true)})
  }

}

class MockMessageDatabase implements MessageDatabase {

  private mockMessages: Array<Message>;

  constructor(mockMessages: Array<Message>) {
    this.mockMessages = mockMessages;
  }

  public addMessage(messages: Array<Object>, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {resolve();})
  }

  public saveMessageName(messageName: string, userId: string): Promise<string> {
    return new Promise((resolve, reject) => {resolve(messageName);})
  }

  public getMessages(messageName: string, userId: string): Promise<Array<Message>> {
    return new Promise((resolve, reject) => {resolve(this.mockMessages);});
  }

}

describe('SaveItClient', () => {

  describe('handleSaveItRequest', () => {

    test('when the RequestStatus is Add, it should response back with `ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ``', async () => {

      const mockMessageDatabase = new MockMessageDatabase([]);
      const mockPlatform = new MockPlatform();
      const saveItClient: SaveItClient = new SaveItClient(mockPlatform, mockMessageDatabase);

      const saveItRequest = new SaveItRequest();
      saveItRequest.setUserId('111000');
      saveItRequest.addMessage({ type: 'text', text: 'ช่วยจำข้อความนี้หน่อย'});
      saveItRequest.setRequestStatus(RequestStatus.Add);
      
      await saveItClient.handleSaveItRequest(saveItRequest);
      const respondedMessages = mockPlatform.saveItReponse.getMessages();

      expect(respondedMessages[0]).toStrictEqual({
        "type": "text",
        "text": "ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ`"
      })
    })

    test('when Request Status is Stop, it should response with `อยากให้ผมจำข้อความพวกนี้ด้วยชื่ออะไรครับ? พิมพ์ `ชื่อ` ตามด้วยชื่อที่ต้องการได้เลยครับ`', async () => {

      const mockMessageDatabase = new MockMessageDatabase([]);
      const mockPlatform = new MockPlatform();
      const saveItClient: SaveItClient = new SaveItClient(mockPlatform, mockMessageDatabase);

      const saveItRequest = new SaveItRequest();
      saveItRequest.setUserId('111000');
      saveItRequest.addMessage({ type: 'text', text: 'พอ' });
      saveItRequest.setRequestStatus(RequestStatus.Stop);

      await saveItClient.handleSaveItRequest(saveItRequest);
      const respondedMessages = mockPlatform.saveItReponse.getMessages();

      expect(respondedMessages[0]).toStrictEqual({
        "type": "text",
        "text": "อยากให้ผมจำข้อความพวกนี้ด้วยชื่ออะไรครับ? พิมพ์ `ชื่อ` ตามด้วยชื่อที่ต้องการได้เลยครับ"
      })

    })

    test('when Request Status is Save, it should response with `ผมจำข้อความนี้ของพี่แล้วครับ ถ้าอยากให้ผมส่งข้อความให้ พิมพ์ `ขอ` ตามด้วยชื่อข้อความได้เลยครับ!`', async () => {

      const mockMessageDatabase = new MockMessageDatabase([]);
      const mockPlatform = new MockPlatform();
      const saveItClient: SaveItClient = new SaveItClient(mockPlatform, mockMessageDatabase);

      const saveItRequest = new SaveItRequest();
      saveItRequest.setUserId('111000');
      saveItRequest.addMessage({ type: 'text', text: 'ชื่อข้อความหนึ่ง'});
      saveItRequest.setMessageName('ข้อความที่หนึ่ง');
      saveItRequest.setRequestStatus(RequestStatus.Save);

      await saveItClient.handleSaveItRequest(saveItRequest);
      const respondedMessages = mockPlatform.saveItReponse.getMessages();

      expect(respondedMessages[0]).toStrictEqual({
        "type": "text",
        "text": "ผมจำข้อความนี้ของพี่แล้วครับ ถ้าอยากให้ผมส่งข้อความให้ พิมพ์ `ขอ` ตามด้วยชื่อข้อความได้เลยครับ! เช่น `ขอข้อความที่หนึ่ง`"
      })

    })

    test('when ResponseStatus is Recall, it should response with the recalling messages', async () => {

      const mockMessageDatabase = new MockMessageDatabase([
        {
          "type": "text",
          "text": "ทดลอง"
        },
        {
          "type": "text",
          "text": "ทดลอง2"
        },
      ]);
      const mockPlatform = new MockPlatform();
      const saveItClient: SaveItClient = new SaveItClient(mockPlatform, mockMessageDatabase);

      const saveItRequest = new SaveItRequest();
      saveItRequest.setUserId('111000');
      saveItRequest.addMessage({ type: 'text', text: 'ขอข้อความหนึ่ง'});
      saveItRequest.setMessageName('ข้อความที่หนึ่ง');
      saveItRequest.setRequestStatus(RequestStatus.Recall);

      await saveItClient.handleSaveItRequest(saveItRequest);
      const respondedMessages = mockPlatform.saveItReponse.getMessages();

      expect([respondedMessages[0], respondedMessages[1]]).toStrictEqual([{
        "type": "text",
        "text": "ทดลอง"
      },
      {
        "type": "text",
        "text": "ทดลอง2"
      }])

    })

  })

})