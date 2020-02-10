import { MessageType, TextMessage, ImageMessage, MessageParser } from '../../saveit'
import { text } from 'body-parser';

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

  describe("equals", () => {

    test('when input is null, it should return false', () => {
      const textMessage = new TextMessage('a');
      const that: null = null
      const result = textMessage.equals(that);
      expect(result).toBe(false);
    })
    
    test('when input is itself, it should return true', () => {
      const textMessage = new TextMessage('a');
      const pointerToTextMessage = textMessage;
      const result = textMessage.equals(pointerToTextMessage);
      expect(result).toBe(true);
    })

    test('when input is different type, it should return false', () => {
      const textMessage = new TextMessage('a');
      const that = ['a', 'b', 'c'];
      const result = textMessage.equals(that);
      expect(result).toBe(false);
    })

    test('when input is same type and equal, it should return true', () => {
      const textMessage = new TextMessage('a');
      const anotherTextMessage = new TextMessage('a');
      const result = textMessage.equals(anotherTextMessage);
      expect(result).toBe(true);
    })

    test('when input is same type and not equal, it should return false', () => {
      const textMessage = new TextMessage('a');
      const anotherTextMessage = new TextMessage('b');
      const result = textMessage.equals(anotherTextMessage);
      expect(result).toBe(false);
    })

  })

  describe("fromJSON", () => {

    test("when input is not valid, it should throw an error", () => {
      const wrongMessageObject = {'type': 'abc', 'text': '123'}
      expect(() => TextMessage.fromJSON(wrongMessageObject)).toThrow('Object must be {"type": "text", "text": string}')
    })

    test("it should return TextMessage", () => {

      const expectedTextMessage = new TextMessage("test from json")
      const result = TextMessage.fromJSON({"type": "text", "text": "test from json"});
      expect(result).toEqual(expectedTextMessage);

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
  
  describe("equals", () => {

    test('when input is null, it should return false', () => {
      const imageMessage = new ImageMessage('www.image.com');
      const that: null = null
      const result = imageMessage.equals(that);
      expect(result).toBe(false);
    })
    
    test('when input is itself, it should return true', () => {
      const imageMessage = new ImageMessage('www.image.com');
      const pointerToImageMessage = imageMessage;
      const result = imageMessage.equals(pointerToImageMessage);
      expect(result).toBe(true);
    })

    test('when input is different type, it should return false', () => {
      const imageMessage = new ImageMessage('www.image.com');
      const that = ['www.image.com', 'b', 'c'];
      const result = imageMessage.equals(that);
      expect(result).toBe(false);
    })

    test('when input is same type and equal, it should return true', () => {
      const imageMessage = new ImageMessage('www.image.com');
      const anotherImageMessage = new ImageMessage('www.image.com');
      const result = imageMessage.equals(anotherImageMessage);
      expect(result).toBe(true);
    })

    test('when input is same type and not equal, it should return false', () => {
      const imageMessage = new ImageMessage('www.image.com');
      const anotherImageMessage = new ImageMessage('www.image2.com');
      const result = imageMessage.equals(anotherImageMessage);
      expect(result).toBe(false);
    })

  })

  describe("fromJSON", () => {

    test("when input is not valid, it should throw an error", () => {
      const wrongMessageObject = {'type': 'abc', 'imageUrl': '123'}
      expect(() => ImageMessage.fromJSON(wrongMessageObject)).toThrow('Object must be {"type": "image", "imageUrl": string}')
    })

    test("it should return ImageMessage", () => {

      const expectedImageMessage = new ImageMessage("www.image.com")
      const result = ImageMessage.fromJSON({"type": "image", "imageUrl": "www.image.com"});
      expect(result).toEqual(expectedImageMessage);

    })

  })

})


describe('MessageParser', () => {

  describe('parseObject', () => {

    test('when input is null, it should throw error', () => {
      expect(() => MessageParser.parseObject(null)).toThrow('Expect valid message JSON object but `null` was given');
    })

    test('when input does not have `type` attribute, it show throw error', () => {
      const wrongMessageObject = {"text": "afdfdf"};
      expect(() => MessageParser.parseObject(wrongMessageObject)).toThrow('Expect `type` attribute in the input object');
    })

    test('when input is TextMessage as JSON, it should return TextMessage', () => {
      const expectedTextMessage: TextMessage = new TextMessage("aaaa");

      const inputTextMessageJSON: Object = {"type": "text", "text": "aaaa"};
      const result = MessageParser.parseObject(inputTextMessageJSON);
      expect(result).toEqual(expectedTextMessage);

    })

    test('when input is ImageMessage as JSON, it should return ImageMessage', () => {
      const expectedImageMessage: ImageMessage = new ImageMessage("www.image.com");

      const inputImageMessage: Object = {"type": "image", "imageUrl": "www.image.com"};
      const result = MessageParser.parseObject(inputImageMessage);
      expect(result).toEqual(expectedImageMessage);

    })

    test('when input does not match any message type, it should throw an error', () => {
      const wrongMessageObject: Object = {"type": "notValid"};
      expect(() => MessageParser.parseObject(wrongMessageObject)).toThrow('The input object does not match any message type');
    })

  })

})