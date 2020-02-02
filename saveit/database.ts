export interface MessageDatabase {
  
  addMessage(messages: Array<Object>, userId: string): Promise<void>;
  saveMessageName(messageName: string, userId: string): Promise<string>;
  getMessages(messageName: string, userId: string): Promise<Array<Object>>;

}
