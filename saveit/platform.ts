import { SaveItRequest } from './saveit-request';
import { SaveItResponse } from './saveit-response'

export interface Platform {

  parseRequest(req: Object): Promise<SaveItRequest>;
  sendMessages(saveItResponse: SaveItResponse): Promise<boolean>;

}
