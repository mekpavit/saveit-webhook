import app from './../../server/server'
const request = require('supertest')
import { messengerClient } from './../../services/messenger-client'

describe('Memorizing messages', () => {

  test('bot should answer `ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ``', async () => {
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
    expect(messengerClient.getLastMessage()).toBe({
      "type": "text",
      "text": "ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ`"
    })
  })

})