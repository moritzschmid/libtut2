import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {UserDetailData} from '../../providers/user-detail-data/user-detail-data';
import {UserDetailDataLocal} from '../../providers/user-detail-data/user-detail-data-local';
import {User}  from '../../providers/user-data/user';
import {ProductDetailsPage} from '../product-details/product-details';

@Component({
  templateUrl: 'build/pages/user-details/user-details.html',
  providers: [UserDetailData, UserDetailDataLocal]

})
export class UserDetailsPage {
  selectedItem: any;
  isoffline: boolean;
  navItem: User;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    public detailDataRemote: UserDetailData,
    public detailDataLocal: UserDetailDataLocal) {

    let self = this;
    self.isoffline = false;

    // If we navigated to this page, we will have an item available as a nav param
    this.navItem = navParams.get('item');

    this.loadLocalDB(this.navItem.userId as number);
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
          return self.selectedItem;
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

            self.selectedItem = data;
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
productTabbed(event, product) {
    this.nav.push(ProductDetailsPage, {
      item: product
    });
  }
  // loadLocalDB(id: number) {
  //   let remoteItem: any = null;
  //   let self = this;
  //   self.selectedItem = self.navItem;
  //   if (self.selectedItem.Lends) {
  //     self.selectedItem.Lends.forEach(element => {
  //       element.lenddate = new Date(element.lenddate);
  //     });
  //   }
  //   console.log(self.selectedItem);
  // }
}
