import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

/*
  Generated class for the DetailData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductDetailData {

  constructor(private http: Http) {

  }

  load(id: number) {
    let self = this;
    // don't have the data yet
    return new Promise(function (resolve, reject) {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      //      this.http.get('data/'+id+'.json')
      // 'http://192.168.178.20:9000/api/product/'+id

      self.http.get("http://192.168.178.20:9000/api/product/" + id)
        //  this.http.get('data/'+id+'.json')
        .timeout(1000)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          resolve(data);
        },
        err => {
          reject(err); });
    });
  }
}

