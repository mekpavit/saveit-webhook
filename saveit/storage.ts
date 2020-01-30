import { Readable } from 'stream';

export interface Storage {

  uploadAndGetUrl(fileName: string, readable: Readable): Promise<string>;

}

