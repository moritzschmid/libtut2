import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import {User} from "../../providers/user-data/user";


let PouchDB = require("pouchdb");
let DBNAME = "users";
/*
  Generated class for the LibData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserDataLocal {
  data: any;
  pouchDb: any;
  constructor(private http: Http) {
    this.data = null;
    this.pouchDb = new PouchDB("libtutDB", { adapter: "websql" });
    this.pouchDb.info().then(console.log.bind(console));
  }
  store(users: Array<User>) {
    let self = this;

    return self.pouchDb.get(DBNAME)


      .then(data => {
        let dbUsers: any = {};
        dbUsers._id = DBNAME;
        dbUsers._rev = data._rev;
        dbUsers.users = users;
        return dbUsers;
      })
      .catch(err => {
        if (err.name === "not_found") {
          let np: any = {};
          np._id = DBNAME;
          np.users = users;
          return np;
        }
      })
      .then(
      data => {
        self.pouchDb.put(data)
          .then(console.log("saved to local db"));
      }
      );
  }

  load() {

    return this.pouchDb.get(DBNAME)
      .then(data => {
        return data.users;
      })
      .catch(function (err) {
        console.log(err);
        throw err;
      });
  }
}