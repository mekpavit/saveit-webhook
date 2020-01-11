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

app.post('/', (req, res) => {
  const text = req.body.events[0].message.text
  const eventToken = req.body.events[0].replyToken
  res.json(client.replyMessage(eventToken, {
    "type": "text",
    "text": "ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ`"
  }))
})

module.exports = app
