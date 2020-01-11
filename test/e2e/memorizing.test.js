jest.mock('@line/bot-sdk', () => ({
  middleware: (config) => (req, res, next) => next()
}))

const line = require('@line/bot-sdk')

import app from './../../server/server'
const request = require('supertest')

describe('Memorizing messages', () => {

  test('it should answer `ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ``', async () => {
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
    const res = await request(app).post('/').send(first_request)
    expect(req.body).toBe({
      "type": "text",
      "text": "ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ`"
    })
  })

  test('it should answer `อยากให้ผมจำข้อความพวกนี้ด้วยชื่ออะไรครับ? พิมพ์ `ชื่อ` ตามด้วยชื่อที่ต้องการได้เลยครับ`', async () => {
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
    const res = await request(app).post('/').send(enough_request)
    expect(res.body).toBe({
      "type": "text",
      "text": "อยากให้ผมจำข้อความพวกนี้ด้วยชื่ออะไรครับ? พิมพ์ `ชื่อ` ตามด้วยชื่อที่ต้องการได้เลยครับ"
    })
  })

  test('it should answer `ผมจำข้อความนี้ของพี่แล้วครับ ถ้าอยากให้ผมส่งข้อความให้ พิมพ์ `ขอ` ตามด้วยชื่อข้อความได้เลยครับ!`', async () => {
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

    const res = await request(app).post('/').send(naming_request)
    expect(res.body).toBe({
      "type": "text",
      "text": "ผมจำข้อความนี้ของพี่แล้วครับ ถ้าอยากให้ผมส่งข้อความให้ พิมพ์ `ขอ` ตามด้วยชื่อข้อความได้เลยครับ!"
    })
  })

})