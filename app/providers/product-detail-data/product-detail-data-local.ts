import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
let PouchDB = require('pouchdb');

/*
  Generated class for the DetailData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductDetailDataLocal {
  data: any;
  pouchDbDetails: any;


  constructor(private http: Http) {
    this.data = null;
    this.pouchDbDetails = new PouchDB('libtutDB_details', { adapter: 'websql' });

  }
  load(id: number) {
    return this.pouchDbDetails.get(id.toString())
      .catch(function (err) {
        console.log('could not load item with ID:' + id + ' Error: ' + err);
        throw err;
      }).then(data => {
        console.log('item loaded from local storage');
        return data;
      });
  }

  upsert(detail: any) {
    if (detail._id) {
      // update
      this.pouchDbDetails.put(detail)
        .then(info => {
          console.log('item updated in local storage');
        })
        .catch(err => {
          console.log('error on updating item: ' + err);
        });
    }
    else {
      // add : use productID as pouchDb ID
      detail._id = detail.productID.toString();
      this.pouchDbDetails.put(detail)
        .then(info => {
          console.log('item added to local storage');
        })
        .catch(err => {
          console.log('error on adding item: ' + err);
        });
    }
  }
}

