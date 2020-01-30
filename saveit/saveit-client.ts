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
    const requestStatus = saveItRequest.getRequestStatus();
    if (requestStatus === RequestStatus.ADD) {
      // do add
    } else if (requestStatus === RequestStatus.STOP) {
      // do stop
    } else if (requestStatus === RequestStatus.SAVE) {
      // do save
    } else if (requestStatus === RequestStatus.RECALL) {
      // do recall
    } else {
      throw new TypeError("No requestStatus provided");
    }
    return true;
  }

}
