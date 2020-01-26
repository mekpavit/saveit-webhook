const express = require('express')
const line = require('@line/bot-sdk')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

const app = express()

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = new line.Client(config)

app.use(line.middleware(config))
app.use(bodyParser.json())

const addMessage = (inputMessages, userId, callback) => {
  MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, db) => {
    if (err) throw err
    const dbo = db.db('db')
    dbo.collection('messages').find({"messagesName": null, "userId": userId}).limit(1).toArray((err, messages) => {
      
      if (messages.length === 0) {
        const messages = {
          messagesName: null,
          userId: userId,
          messages: inputMessages
        }
        dbo.collection('messages').insertOne(messages, (err, res) => {
          callback(err, res)
          db.close()
        })

      } else {
        dbo.collection('messages').updateOne({"messagesName": null, "userId": userId}, {$push: {"messages": {$each: inputMessages}}}, (err, res) => {
          callback(err, res)
          db.close()
        })
      }
    })
  })
}

const saveMessage = (messagesName, userId, callback) => {
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    if (err) throw err
    const dbo = db.db('db')
    dbo.collection('messages').updateOne({"messagesName": null, "userId": userId}, {$set: {"messagesName": messagesName}}, (err, res) => {
      callback(err, res)
      db.close()
    })
  })
}

const getMessages = (messagesName, userId, callback) => {
  return MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    if (err) throw err
    const dbo = db.db('db')
    return dbo.collection('messages').findOne({"messagesName": messagesName, "userId": userId}, (err, res) => {
      callback(err, res)
      db.close()
    })
  })
}

app.post('/', (req, res) => {
  
  const message = req.body.events[0].message
  const eventToken = req.body.events[0].replyToken
  const userId = req.body.events[0].source.userId

  if (message.text.trim().indexOf('ขอ') === 0) {
    const messagesName = message.text.trim().replace('ขอ', '')
    getMessages(messagesName, userId, (err, messages) => {
      const newMessages = []
      messages.messages.forEach((message) => {
        newMessages.push({"type": message.type, "text": message.text})
      })
      res.json(client.replyMessage(eventToken, newMessages))
    })

  } else if (message.text.trim().indexOf('ชื่อ') === 0) {

    const messagesName = message.text.trim().replace('ชื่อ', '')
    saveMessage(messagesName, userId, (err, result) => {
      if (err) throw err
      res.json(client.replyMessage(eventToken, {
        "type": "text",
        "text": "ผมจำข้อความนี้ของพี่แล้วครับ ถ้าอยากให้ผมส่งข้อความให้ พิมพ์ `ขอ` ตามด้วยชื่อข้อความได้เลยครับ!"
      }))  
    })
    
  } else if (message.text.trim().indexOf('พอ') === 0) {

    res.json(client.replyMessage(eventToken, {
      "type": "text",
      "text": "อยากให้ผมจำข้อความพวกนี้ด้วยชื่ออะไรครับ? พิมพ์ `ชื่อ` ตามด้วยชื่อที่ต้องการได้เลยครับ"
    }))

  } else {
    messages = req.body.events.map((event) => { return event.message })
    addMessage(messages, userId, (err, result) => {
      if (err) throw err
      res.json(client.replyMessage(eventToken, {
        "type": "text",
        "text": "ถ้ามีข้อความที่อยากให้ผมจำอีก พิมพ์มาได้เลยนะครับ! ถ้าไม่มีแล้ว พิมพ์ว่า `พอ`"
      }))
    })
  }
  
})

module.exports = app
