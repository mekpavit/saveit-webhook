import * as mongo from 'mongodb';

export interface MessageDatabase {
  
  addMessage(messages: Array<Object>, userId: string): Promise<void>;
  saveMessageName(messageName: string, userId: string): Promise<string>;
  getMessages(messageName: string, userId: string): Promise<Array<Object>>;

}

export class MongoDBMessageDatabase implements MessageDatabase {

  private _mongoUrl: string;
  private _dbName: string;
  private _collectionName: string;

  constructor(mongoUrl: string, dbName: string, collectionName: string) {
    this._mongoUrl = mongoUrl;
    this._dbName = dbName;
    this._collectionName = collectionName;
  }

  public addMessage(messages: Array<Object>, userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      mongo.MongoClient.connect(this._mongoUrl, {
        useNewUrlParser: true
      }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(this._dbName);
        dbo.collection(this._collectionName).find({"messagesName": null, "userId": userId}).limit(1).toArray((err, foundMessages) => {
          
          if (foundMessages.length === 0) {
            const messagesDoc = {
              'messagesName': null,
              'userId': userId,
              'messages': messages
            };
            dbo.collection(this._collectionName).insertOne(messagesDoc, (err, res) => {
              db.close().then(() => resolve())
            })
    
          } else {
            dbo.collection(this._collectionName).updateOne({"messagesName": null, "userId": userId}, {$push: {"messages": {$each: inputMessages}}}, (err, res) => {
              db.close().then(() => resolve())
            })
          }
        })
      })
    })
  }

  public saveMessageName(messageName: string, userId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      mongo.MongoClient.connect(this._mongoUrl, (err, db) => {
        if (err) throw err
        const dbo = db.db(this._dbName)
        dbo.collection(this._collectionName).updateOne({"messagesName": null, "userId": userId}, {$set: {"messagesName": messageName}}, (err, res) => {
          db.close().then(() => resolve(messageName))
        })
      })
    })
  }

  public getMessages(messageName: string, userId: string): Promise<Array<Object>> {
    return new Promise<Array<Object>>((resolve, reject) => {
      mongo.MongoClient.connect(process.env.MONGO_URL, (err, db) => {
        if (err) throw err
        const dbo = db.db('db')
        return dbo.collection('messages').findOne<{messages: Array<Object>}>({"messagesName": messageName, "userId": userId}, (err, res) => {
          db.close().then(() => resolve(res.messages));
        })
      })
    })
  }

}