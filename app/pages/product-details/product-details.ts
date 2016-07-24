import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ProductDetailData} from '../../providers/product-detail-data/product-detail-data';
import {ProductDetailDataLocal} from '../../providers/product-detail-data/product-detail-data-local';
import {Product}  from '../../providers/product-data/product';
import {UserDetailsPage} from '../user-details/user-details';

@Component({
  templateUrl: 'build/pages/product-details/product-details.html',
  providers: [ProductDetailData, ProductDetailDataLocal]

})
export class ProductDetailsPage {
  selectedItem: any;
  isoffline: boolean;
  navItem: Product;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    public detailDataRemote: ProductDetailData,
    public detailDataLocal: ProductDetailDataLocal) {

    let self = this;
    self.isoffline = true;

    // If we navigated to this page, we will have an item available as a nav param
    this.navItem = navParams.get('item');

    this.loadLocalDB(this.navItem.productID as number);
  }


  loadLocalDB(id: number) {
    let remoteItem: any = null;
    let self = this;

    self.detailDataLocal.load(id)
      .catch(err => {
        if (err.name === 'not_found') {
          // init something to show
          // do not set _id to prevent 
          console.log('using navigation Item');
          self.selectedItem = self.navItem;
          self.selectedItem._id = null;
          self.selectedItem._rev = null;
          return self.selectedItem ;
        }
        throw err;
      })
      .then(data => {
        // use data from local Db
        self.selectedItem = data;
        return data;
      })
      .then(function (localItem: any) {
        // load remote data
        self.detailDataRemote.load(id)
          .then(data => {
            self.isoffline = false;
            console.log('item loaded from remote storage');
            console.log(data);

            self.selectedItem = data[0];
            self.selectedItem._id = localItem._id;
            self.selectedItem._rev = localItem._rev;
            self.detailDataLocal.upsert(self.selectedItem);
          })
          .catch(err => {
            // we're offline
            if (err.name !== 'timeout') {
              console.log('timeout');
              self.isoffline = true;
            } else
              throw err;
          });
      }
      );
  }
  userTapped(event, user) {
    this.nav.push(UserDetailsPage, {
      item: user
    });
  }
}
