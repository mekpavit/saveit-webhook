class SaveItClient {

  private _storage: Storage;
  private _db: Database;;
  private _platform: Platform

  constructor(platform: Platform, db: Database, storage: Storage) {
    this._storage = storage;
    this._db = db;
    this._platform = platform;
  }

  public handleHTTPRequest(req: Object): boolean {

    const saveItRequest: SaveItRequest = this._platform.parseRequest(req);
    if (saveItRequest.requestStatus === RequestStatus.ADD) {
      // do ADD
    }
    if (saveItRequest.requestStatus === RequestStatus.STOP) {
      // do STOP
    }
    if (saveItRequest.requestStatus === RequestStatus.SAVE) {
      // do SAVE
    }
    if (saveItRequest.requestStatus === RequestStatus.RECALL) {
      // do RECALL
    }

  }

}

interface Storage {

}

interface Database {

}

interface Platform {

  parseRequest(req: Object): SaveItRequest;

}

class SaveItRequest {

  public userId: string;
  public platformName: string;
  public messages: Array<Object>;
  public requestStatus: RequestStatus;

}

enum RequestStatus {ADD, STOP, SAVE, RECALL}
