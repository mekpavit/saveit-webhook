jest.mock('@line/bot-sdk', () => ({
  middleware: (config) => (req, res, next) => next(),
  Client: (config) => ({
    replyMessage: (replyToken, message) => (message),
  })
}))

import app from './../../server/server'
const request = require('supertest')

describe('Recalling messages', () => {

  test('it should recall messages when input is `ขอข้อความที่1`', async () => {
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
    await request(app).post('/').send(first_request)
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
        }
      ],
      "destination": "dddd"
    }
    await request(app).post('/').send(second_request)

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
    await request(app).post('/').send(enough_request)

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
    await request(app).post('/').send(naming_request)

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
    const res = await request(app).post('/').send(recalling_request)
    expect(res.body).toStrictEqual([
      {
        "type": "text",
        "text": "ข้อความนี้ คือ สิ่งที่อยากให้จำ"
      },
      {
        "type": "text",
        "text": "ข้อความนี้ คือ อีกข้อความที่อยากให้จำ"
      }
    ])
  })

})