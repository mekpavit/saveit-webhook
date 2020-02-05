import { MessageType, TextMessage, ImageMessage } from '../../saveit'
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

    test("it should return TextMessage", () => {

      const expectedImageMessage = new TextMessage("www.image.com")
      const result = ImageMessage.fromJSON({"type": "text", "imageUrl": "www.image.com"});
      expect(result).toEqual(expectedImageMessage);

    })

  })

})