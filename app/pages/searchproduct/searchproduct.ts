import {Component} from '@angular/core';

import {ControlGroup, Control } from '@angular/common';
import {NavController, NavParams} from 'ionic-angular';
import {Product} from '../../providers/product-data/product';
import {ProductData} from '../../providers/product-data/product-data';
import {ProductsPage} from '../products/products';

@Component({
  templateUrl: 'build/pages/searchproduct/searchproduct.html',
  providers: [ProductData]
})
export class SearchProductPage {
  parentPage: ProductsPage;
  form: ControlGroup;
  constructor(private nav: NavController, navParams: NavParams, public libdataRemote: ProductData) {
    
    this.parentPage = navParams.get('delegate');
    this.form = new ControlGroup({
      product: new ControlGroup({
        productID: new Control(),
        titel: new Control(),
        beschreibung: new Control(),
        autor: new Control(),
        fach: new Control(),
        isbn: new Control(),
        teilbereich: new Control(),
        verlag: new Control(),
      })
    });
  }
  navback() {
    this.nav.pop();
  }

  search() {

    let product: Product;
    product = this.form.value.product as Product;
    console.log(product);

    var self = this;
    // self.parentPage.isloading = true;
    self.libdataRemote.search(product).then(data => {
      if (data) {
        self.parentPage.products = data as Array<Product>;
        self.parentPage.showReload  = true;
      } else {
        alert('FUCK OFF');
      }
    }).then(
      function () {
        self.parentPage.isloading = false;
        self.navback();
      });
    return true;
  }
}
