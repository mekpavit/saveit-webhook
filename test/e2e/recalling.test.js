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

describe('Recalling messages', () => {

  test('it should recall messages when input is `ขอข้อความที่1`', (done) => {
    const first_request = {
      "events": [
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "bbbb",
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
            "userId": "bbbb",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "ข้อความนี้ คือ อีกข้อความที่อยากให้จำ"
          }
        },
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "bbbb",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "ข้อความนี้ คือ อีกข้อความที่อยากให้จำ2"
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
            "userId": "bbbb",
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
            "userId": "bbbb",
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
    const recalling_request = {
      "events": [
        {
          "type": "message",
          "replyToken": "aaaa",
          "source": {
            "userId": "bbbb",
            "type": "user"
          },
          "timestamp": 1578194471425,
          "mode": "active",
          "message": {
            "type": "text",
            "id": "cccc",
            "text": "ขอข้อความที่1"
          }
        }
      ],
      "destination": "dddd"
    }

    request(app).post('/').send(first_request).expect(200, (err, res) => {
      request(app).post('/').send(second_request).expect(200, (err, res) => {
        request(app).post('/').send(enough_request).expect(200, (err, res) => {
          request(app).post('/').send(naming_request).expect(200, (err, res) => {
            request(app).post('/').send(recalling_request).expect(
              [{"text": "ข้อความนี้ คือ สิ่งที่อยากให้จำ", "type": "text"}, {"text": "ข้อความนี้ คือ อีกข้อความที่อยากให้จำ", "type": "text"}, {"text": "ข้อความนี้ คือ อีกข้อความที่อยากให้จำ2", "type": "text"}]
            , done)
          })
        })
      })
    })

  })
})