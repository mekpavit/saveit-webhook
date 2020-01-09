import { MessengerClient } from './messenger-client'

class SaveItClient {

  constructor(private messengerClient: MessengerClient = null) {
    this.messengerClient = messengerClient
  }

}

export default SaveItClient