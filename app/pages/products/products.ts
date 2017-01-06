import {Component} from '@angular/core';
import {Loading, NavController, NavParams } from 'ionic-angular';
import {ProductDetailsPage} from '../product-details/product-details';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';
import {AddProductPage} from '../addproduct/addproduct';
import {SearchProductPage} from '../searchproduct/searchproduct';
import {ProductData} from '../../providers/product-data/product-data';
import {ProductDataLocal} from '../../providers/product-data/product-data-local';
import {Product} from '../../providers/product-data/product';
import {Keyboard} from 'ionic-native';
import {Dialogs} from 'ionic-native';


@Component({
  templateUrl: 'build/pages/products/products.html',
  providers: [ProductData, ProductDataLocal]
})


export class ProductsPage {
  selectedItem: any;
  products: Array<Product>;
  isloading: boolean;
  hasError: boolean;
  searchfilter: string;
  showReload: boolean;

  constructor(private nav: NavController, navParams: NavParams, public libdataRemote: ProductData, public libdatalocal: ProductDataLocal) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.products = new Array<Product>();
    this.isloading = true;
    this.hasError = false;
    this.showReload = false;
    this.loadLocalDB();
    Keyboard.hideKeyboardAccessoryBar(true);
    console.log('constructor done ');
  }


  loadLocalDB() {
    let self = this;
    this.showReload = false;

    return self.libdatalocal.load()
      .then(data => { self.products = data; })
      .then(function () {
        self.isloading = false;
        console.log('loading done');
      }
      )
      .catch(function (err) {
        console.log(err.message);
        self.hasError = true;
        self.isloading = false;
      });
  }

  itemTapped(event, item) {
    this.nav.push(ProductDetailsPage, {
      item: item
    });
  }

  addTapped() {
    this.nav.push(AddProductPage, {});
  }

  searchTapped() {
    this.nav.push(SearchProductPage, {
        delegate: this
       });

  }

  onClickOffline() {
    console.log('onClickOffline()');
    Dialogs.alert('Es besteht keine verbindung zur Bibliothek', 'Offline', 'ok');
  }

  doRefresh(refresher) {

    let loading = Loading.create({
      content: 'Please wait...',
    });

    this.nav.present(loading);

    let self = this;
    self.searchfilter = '';
    self.isloading = true;
    this.hasError = false;
    console.log('reload()');
    refresher.complete();
    self.loadRemoteDB()
      .then(function () {
        self.libdatalocal.store(self.products)
          .then(function () {
            console.log('storelocal done');
            self.isloading = false;
            loading.dismiss();

          });
      })
      .catch(function (err) {
        console.log(err.message);
        self.hasError = true;
        self.isloading = false;
        loading.dismiss();
        refresher.complete();
      });
  }

  loadRemoteDB() {
    let self = this;
    return self.libdataRemote
      .load()
      .then(data => {
        let p = data as Array<Product>;
        self.products = p.sort((n1, n2) => n1.titel.localeCompare(n2.titel as string));
      });
  }

  loadfiltered() {
    let self = this;
    self.loadLocalDB()
      .then(function () {
          let result = self.products.filter(function (product) {
            return product.titel.search(new RegExp(self.searchfilter, 'i')) >= 0;   
          });
          self.products.splice(0, self.products.length);
          self.products = result;
      });
  }

  onCancel(event) {
    console.log('onCancel');
    // seems to be softkeyboardbutton
    if (event.x + event.y === 0 && event.type === 'click')
      return;
    Keyboard.close();
  }

}