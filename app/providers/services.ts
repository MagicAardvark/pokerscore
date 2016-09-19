import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { Events, LocalStorage, Storage, SqlStorage } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';


@Injectable()
export class PS_Service {
  _favorites = [];
  SESSION_ID = "SESSION_ID";
  storage: any

  constructor(private events: Events, private http: Http) {
      this.storage = new Storage(SqlStorage, {name: 'PokerScore_db'});
  }

  set(key, val) {
    return this.storage.set(key, val);
  }

  get(key) {
    return this.storage.get(key).then((value) => {
      return value;
    });
  }

}
