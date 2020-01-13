const { MongoClient } = require('mongodb')

export class Messages {

  messages: any

  constructor() {
    this.messages = null
  }

  async connect() {
    const connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    const db = await connection.db()
    this.messages = await db.collection('messages')
  }


  public addMessage = async (message, userId) => {
    console.log(message, this.messages)
    if (await this.messages.find({messagesName: null, userId}).limit(1).toArray().length == 0) {
      const messages = {
        messagesName: null,
        userId,
        messages: [
          message
        ]
      }
      await this.messages.insertOne(messages)
    } else {
      await this.messages.updateOne({messagesName: null, userId}, {$push: {messages: message}})
    }
  }

  public saveMessages = async (messagesName, userId) => {
    await this.messages.updateOne({messagesName: null, userId}, {$set: {messagesName}})
  }

  public getMessagesFromMessagesName = async (messagesName, userId) => {
    return await this.messages.findOne({messagesName, userId}).toArray().messages
  }

}