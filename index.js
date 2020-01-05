const express = require('express')
const fs = require('fs')
const middleware = require('@line/bot-sdk').middleware
require('dotenv').config()

const app = express()
const port = 3000

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

app.post('/', middleware(config), (req, res) => {
  fs.writeFile('latest_request.txt', JSON.stringify(req.body, null, 2), function (err) {
    if (err) throw err;
    console.log(JSON.stringify(req.body, null, 2));
    res.json('OK')
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))