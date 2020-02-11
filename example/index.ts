import express from 'express';
import { GoogleCloudStorage, MongoDBMessageDatabase, LINEPlatform, SaveItClient } from './../saveit'
import dotenv from 'dotenv';
import * as line from '@line/bot-sdk';
dotenv.config()

const app = express();
const port = process.env.PORT;
const storage = new GoogleCloudStorage(process.env.SERVICE_ACCOUNT_JSON_FILE_PATH, 'saveit-webhook-storage');
const db = new MongoDBMessageDatabase(process.env.MONGO_URL, 'db', 'message');
const platform = new LINEPlatform(process.env.CHANNEL_ACCESS_TOKEN, process.env.CHANNEL_SECRET, storage);
const saveItClient = new SaveItClient(platform, db);

const middleware = line.middleware({
  'channelAccessToken': process.env.CHANNEL_ACCESS_TOKEN,
  'channelSecret': process.env.CHANNEL_SECRET
})

app.post('/', middleware, async (req, res) => {
  console.log(req.body);
  const result = await saveItClient.handleHTTPRequest(req);
  res.send(result);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
