import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Product} from "../../providers/product-data/product";


@Component({
  templateUrl: "build/pages/addproduct/addproduct.html"
})
export class AddProductPage {
  product: Product;
  constructor(private nav: NavController, navParams: NavParams) {
    this.product = new Product();
  }

  navback() {
    this.nav.pop();
  }

  save() {
    console.log(JSON.stringify(this.product));
  }
}
