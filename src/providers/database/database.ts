import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class DatabaseProvider {

  constructor(public db: Storage) {
    console.log('Hello DatabaseProvider Provider');
  }

  create(key: any, value: any): Promise<any> {
    return this.db.set(key, value);
  }

  isReady(): Promise<LocalForage> {
    return this.db.ready();
  }

  whichDriver(): string {
    return this.db.driver;
  }

  get(key: any): Promise<any> {
    return this.db.get(key);
  }

  remove(key: any): Promise<any> {
    return this.db.remove(key);
  }

  clear(): Promise<any> {
    return this.db.clear();
  }

  length(): Promise<any> {
    return this.db.length();
  }

  keys(): Promise<any> {
    return this.db.keys();
  }
}
