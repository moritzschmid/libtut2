import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Product} from '../../providers/product-data/product';


let PouchDB = require('pouchdb');
let DBNAME = 'products';
/*
  Generated class for the LibData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductDataLocal {
  data: any;
  pouchDb: any;

  constructor() {
    this.data = null;
    this.pouchDb = new PouchDB('libtutDB', { adapter: 'websql' });
    this.pouchDb.info().then(console.log.bind(console));
  }
  store(products: Array<Product>) {
    let self = this;

    return self.pouchDb.get(DBNAME)
      .then(data => {
        let dbProducts: any = {};
        dbProducts._id = DBNAME;
        dbProducts._rev = data._rev;
        dbProducts.products = products;
        return dbProducts;
      })
      .catch(err => {
        if (err.name === 'not_found') {
          let np: any = {};
          np._id = DBNAME;
          np.products = products;
          return np;
        }
      })
      .then(
      data => {
        self.pouchDb.put(data);
      }
      )
      .then(console.log('saved to local db')
      );
  }

  load() {
    return this.pouchDb.get(DBNAME)
      .then(data => {
        return data.products;
      })
      .catch(function (err) {
        console.log(err);
        throw err;
      });
  }
}