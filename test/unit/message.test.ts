import { MessageType, TextMessage, ImageMessage } from '../../saveit'

describe("TextMessage", () => {

  describe("toJSON", () => {

    test("it should return correct object", () => {

      const textMessage = new TextMessage("This is the test text message");

      expect(textMessage.toJSON()).toStrictEqual({
        "type": MessageType.Text,
        "text": "This is the test text message"
      })
      
    })

  }) 

})

describe("ImageMessage", () => {

  describe("toJSON", () => {

    test("it should return correct object", () => {

      const imageMessage = new ImageMessage("https://mytestimage.com");

      expect(imageMessage.toJSON()).toStrictEqual({
        "type": MessageType.Image,
        "imageUrl": "https://mytestimage.com"
      })
      
    })

  }) 

})