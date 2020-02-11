import { Readable } from 'stream';
import { Storage as GoogleCloudStorageClient } from '@google-cloud/storage';

export interface Storage {

  uploadAndGetUrl(fileName: string, readable: Readable): Promise<string>;
  getSignedUrlFromFileName(fileName: string): Promise<string>;

}

export class GoogleCloudStorage implements Storage {

  private _serviceAccountJSONFilePath: string;
  private _bucketName: string;

  constructor(serviceAccountJSONFilePath: string, bucketName: string) {
    this._serviceAccountJSONFilePath = serviceAccountJSONFilePath;
    this._bucketName = bucketName;
  }

  public uploadAndGetUrl(fileName: string, readable: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = new GoogleCloudStorageClient({'keyFilename': this._serviceAccountJSONFilePath});
      const bucket = storage.bucket(this._bucketName);
      const file = bucket.file(fileName);

      readable.pipe(file.createWriteStream())
      resolve(fileName);
    })
  }

  public getSignedUrlFromFileName(fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const storage = new GoogleCloudStorageClient({'keyFilename': this._serviceAccountJSONFilePath});
      const bucket = storage.bucket(this._bucketName);
      const file = bucket.file(fileName);

      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() + 1);
      file.getSignedUrl({
        action: 'read',
        expires: expiredDate.toISOString()
      }).then(signedUrls => {
        resolve(signedUrls[0]);
      });
    })
  }

}
