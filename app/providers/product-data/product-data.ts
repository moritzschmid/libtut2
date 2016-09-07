import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {Product} from '../../providers/product-data/product';


/*
  Generated class for the LibData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductData {
  data: any;
  constructor(private http: Http) {
    this.data = null;

  }

  load() {
    // if (this.data) {
    //   // already loaded data
    //   return Promise.resolve(this.data);
    // }
    let self = this;
    // don't have the data yet
    return new Promise(function (resolve, reject) {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      console.log('loading products');
      // this.http.get('data/product.json')


      self.http
        .get('http://libtutservice.azurewebsites.net/api/product')
        .timeout(5000)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          self.data = data;
          resolve(self.data);
        }, err => {
          reject(err);
        });
    });
  }

  search(product: Product) {

    let self = this;
    // don't have the data yet
    return new Promise(function (resolve, reject) {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      console.log('searching products');
      console.log(product);

      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      self.http
        .post('http://192.168.178.20:8100/api/product', product, { headers })
        // .post('http://libtutservice.azurewebsites.net/api/product', product, { headers })
        .timeout(5000)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          self.data = data;
          resolve(self.data);
        }, err => {
          reject(err);
        });
    });
  }
}