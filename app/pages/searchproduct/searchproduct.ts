import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Product} from '../../providers/product-data/product';
import {ProductData} from '../../providers/product-data/product-data';
import {ProductsPage} from '../products/products';

@Component({
  templateUrl: 'build/pages/searchproduct/searchproduct.html',
  providers: [ProductData]
})
export class SearchProductPage {
  product: Product;
  parentPage: ProductsPage;
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
    this.parentPage = navParams.get('delegate');

  }

  navback() {
    this.nav.pop();
  }

  search() {
    console.log(JSON.stringify(this.product));
    var self = this;
    self.libdataRemote.search(this.product).then(data => {
      self.parentPage.products = data as Array<Product>;
    }).then(
      function () {
        self.navback();
      });
  }
}
