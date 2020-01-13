const express = require('express')
const line = require('@line/bot-sdk')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
const port = 3000

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = line.Client(config)

app.use(line.middleware(config))
app.use(bodyParser.json())

const messageDatabase = {}

app.post('/', (req, res) => {
  
  const text = req.body.events[0].message.text
  const eventToken = req.body.events[0].replyToken
  if (text.trim().indexOf('ชื่อ') === 0) {
    res.json(client.replyMessage(eventToken, {
      "type": "text",
      "text": "ผมจำข้อความนี้ของพี่แล้วครับ ถ้าอยากให้ผมส่งข้อความให้ พิมพ์ `ขอ` ตามด้วยชื่อข้อความได้เลยครับ!"
    }))
  } else if (text.trim().indexOf('พอ') === 0) {
    res.json(client.replyMessage(eventToken, {
      "type": "text",
      "text": "อยากให้ผมจำข้อความพวกนี้ด้วยชื่ออะไรครับ? พิมพ์ `ชื่อ` ตามด้วยชื่อที่ต้องการได้เลยครับ"
    }))
  } else {
    res.json(client.replyMessage(eventToken, {
      "type": "text",
      "text": "ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ`"
    }))
  }
  
})

module.exports = app
