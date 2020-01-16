class MockClient {
  constructor(config) {
    // pass
  }
  replyMessage(replyToken, message) {
    return message
  }
}

jest.mock('@line/bot-sdk', () => ({
  middleware: (config) => (req, res, next) => next(),
  Client: MockClient
}))

const app = require('./../../server/server')
const request = require('supertest')

describe('Memorizing messages', () => {

  test('it should answer `ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ``', (done) => {
    const first_request = {
      "events": [
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "aaaa",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "ข้อความนี้ คือ สิ่งที่อยากให้จำ"
          }
        }
      ],
      "destination": "dddd"
    }
    request(app).post('/').send(first_request).expect({
      "type": "text",
      "text": "ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ`"
    }, done)
  })

  test('it should answer `อยากให้ผมจำข้อความพวกนี้ด้วยชื่ออะไรครับ? พิมพ์ `ชื่อ` ตามด้วยชื่อที่ต้องการได้เลยครับ`', (done) => {
    const first_request = {
      "events": [
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "cccc",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "ข้อความนี้ คือ สิ่งที่อยากให้จำ"
          }
        }
      ],
      "destination": "dddd"
    }
    const second_request = {
      "events": [
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "cccc",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "ข้อความนี้ คือ อีกข้อความที่อยากให้จำ"
          }
        }
      ],
      "destination": "dddd"
    }

    const enough_request = {
      "events": [
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "dddd",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "พอ"
          }
        }
      ],
      "destination": "dddd"
    }

    request(app).post('/').send(first_request).expect(200, (err, res) => {
      request(app).post('/').send(second_request).expect(200, (err, res) => {
        request(app).post('/').send(enough_request).expect({
          "type": "text",
          "text": "อยากให้ผมจำข้อความพวกนี้ด้วยชื่ออะไรครับ? พิมพ์ `ชื่อ` ตามด้วยชื่อที่ต้องการได้เลยครับ"
        }, done)
      })
    })

  })

  test('it should answer `ผมจำข้อความนี้ของพี่แล้วครับ ถ้าอยากให้ผมส่งข้อความให้ พิมพ์ `ขอ` ตามด้วยชื่อข้อความได้เลยครับ!`', (done) => {
    const first_request = {
      "events": [
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "dddd",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "ข้อความนี้ คือ สิ่งที่อยากให้จำ"
          }
        }
      ],
      "destination": "dddd"
    }

    const second_request = {
      "events": [
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "dddd",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "ข้อความนี้ คือ อีกข้อความที่อยากให้จำ"
          }
        }
      ],
      "destination": "dddd"
    }

    const enough_request = {
      "events": [
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "dddd",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "พอ"
          }
        }
      ],
      "destination": "dddd"
    }

    const naming_request = {
      "events": [
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "dddd",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "ชื่อข้อความที่1"
          }
        }
      ],
      "destination": "dddd"
    }

    request(app).post('/').send(first_request).expect(200, (err, res) => {
      request(app).post('/').send(second_request).expect(200, (err, res) => {
        request(app).post('/').send(enough_request).expect(200, (err, res) => {
          request(app).post('/').send(naming_request).expect({
            "type": "text",
            "text": "ผมจำข้อความนี้ของพี่แล้วครับ ถ้าอยากให้ผมส่งข้อความให้ พิมพ์ `ขอ` ตามด้วยชื่อข้อความได้เลยครับ!"
          }, done)
        })
      })
    })

  })

})