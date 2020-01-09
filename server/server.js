const express = require('express')
const middleware = require('@line/bot-sdk').middleware
require('dotenv').config()

const app = express()
const port = 3000

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

app.post('/', middleware(config), (req, res) => {
  const eventObject = req.body
  res.send(handleRequest(eventObject))
})

module.exports = app
