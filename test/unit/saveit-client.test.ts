import { SaveItClient, SaveItRequest, SaveItResponse, Platform, MessageDatabase, TextMessage, RequestStatus } from './../../saveit';

class MockPlatform implements Platform {

  public saveItReponse: SaveItResponse;
  public parseRequest(): Promise<SaveItRequest> {return new Promise((resolve, reject) => {resolve();})}
  public sendMessages(saveItReponse: SaveItResponse): Promise<boolean> {
    this.saveItReponse = saveItReponse;
    return new Promise((resolve, reject) => {resolve(true)})
  }

}

class MockMessageDatabase implements MessageDatabase {

  private mockMessages: Array<Object>;

  constructor(mockMessages: Array<Object>) {
    this.mockMessages = mockMessages;
  }

  public addMessage(messages: Array<Object>, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {resolve();})
  }

  public saveMessageName(messageName: string, userId: string): Promise<string> {
    return new Promise((resolve, reject) => {resolve(messageName);})
  }

  public getMessages(messageName: string, userId: string): Promise<Array<Object>> {
    return new Promise((resolve, reject) => {resolve(this.mockMessages);});
  }

}

describe('SaveItClient', () => {

  describe('handleSaveItRequest', () => {

    test('it should response back with `ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ``', async () => {

      const mockMessageDatabase = new MockMessageDatabase([]);
      const mockPlatform = new MockPlatform();
      const saveItClient: SaveItClient = new SaveItClient(mockPlatform, mockMessageDatabase);

      const saveItRequest = new SaveItRequest();
      saveItRequest.setUserId('111000');
      saveItRequest.addMessage(new TextMessage("ช่วยจำข้อความนี้หน่อย"));
      saveItRequest.setRequestStatus(RequestStatus.Add);
      
      await saveItClient.handleSaveItRequest(saveItRequest);
      const respondedMessages = mockPlatform.saveItReponse.getMessages();

      expect(respondedMessages[0].toJSON()).toStrictEqual({
        "type": "text",
        "text": "ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ`"
      })
    })

  })

})