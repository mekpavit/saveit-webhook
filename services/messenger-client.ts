require('dotenv').config()

export interface MessengerClient {

}

class StubMessagerClient implements MessengerClient {

}

class LineMessengerClient implements MessengerClient {

}

const getMessengerClient = () => {
  if (process.env.NODE_ENV === 'test') {
    const messengerClient = new StubMessagerClient()
    return messengerClient
  } else {
    const messengerClient = new LineMessengerClient()
    return messengerClient
  }
}

export const messengerClient = getMessengerClient()