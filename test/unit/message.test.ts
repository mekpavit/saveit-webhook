import { MessageType, TextMessage, ImageMessage } from '../../saveit'

describe("TextMessage", () => {

  describe("toJSON", () => {

    test("it should return correct object", () => {

      const textMessage = new TextMessage("This is the test text message");

      expect(textMessage.toJSON()).toStrictEqual({
        "type": MessageType.TEXT,
        "text": "This is the test text message"
      })
      
    })

  }) 

})