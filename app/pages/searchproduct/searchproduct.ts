import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Product} from '../../providers/product-data/product';
import {ProductData} from '../../providers/product-data/product-data';


@Component({
  templateUrl: 'build/pages/searchproduct/searchproduct.html',
  providers: [ProductData]
})
export class SearchProductPage {
  product: Product;
  constructor(private nav: NavController, navParams: NavParams, public libdataRemote: ProductData) {
    this.product = new Product();
    this.product.titel = '';
    this.product.beschreibung = '';
    this.product.autor = '';
    this.product.beschreibung = '';
    this.product.fach = '';
    this.product.isbn = '';
    this.product.productID = 0;
    this.product.teilbereich = '';
    this.product.verlag = '';
    
   
  }

  navback() {
    this.nav.pop();
  }

  search() {
    console.log(JSON.stringify(this.product));
    var self = this;
    self.libdataRemote.search(JSON.stringify(this.product)).then(data => {
      console.log(data);
      
    });
  }
}
