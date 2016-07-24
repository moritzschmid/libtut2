import {Component} from '@angular/core';
import {Loading, NavController, NavParams} from 'ionic-angular';
import {UserDetailsPage} from '../user-details/user-details';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';
// import {AddUserPage} from '../addproduct/addproduct'
import {UserData} from '../../providers/user-data/user-data';
import {UserDataLocal} from '../../providers/user-data/user-data-local';
import {Keyboard} from 'ionic-native';
import {User} from '../../providers/user-data/user';
import {BarcodeScanner} from 'ionic-native';
import {Dialogs} from 'ionic-native';


@Component({
  templateUrl: 'build/pages/users/users.html',
  providers: [UserData, UserDataLocal]
})


export class UsersPage {
  selectedItem: any;
  users: Array<User>;
  isloading: boolean;
  hasError: boolean;
  searchfilter: string;

  constructor(private nav: NavController, navParams: NavParams, public libdataRemote: UserData, public libdatalocal: UserDataLocal) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.users = new Array<User>();
    this.isloading = true;
    this.hasError = false;

    this.loadLocalDB();
    Keyboard.hideKeyboardAccessoryBar(true);
    console.log('constructor done ');
  }


  loadLocalDB() {
    let self = this;
    return self.libdatalocal.load()
      .then(data => { self.users = data; })
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
    this.nav.push(UserDetailsPage, {
      item: item
    });
  }

  onClickOffline() {
    console.log('onClickOffline()');
    Dialogs.alert('Es besteht keine verbindung zur Bibliothek', 'Offline', 'ok');
  }

  addTapped() {
    console.log('addTapped()');
    // this.nav.push(AddProductPage, {});
  }

  startScan() {
    console.log('startScan()');
    let self = this;
    BarcodeScanner.scan().then((barcodeData) => {
     
      console.log('scanText: ' + barcodeData.text); 
      self.onInput('').then(function () {
        let result = self.users.filter(u => u.userId === Number(barcodeData.text));
        if (result.length === 1) {
          self.nav.push(UserDetailsPage, {
            item: result[0]
          });
        } else {
          Dialogs.alert('User mit Id \'' + barcodeData.text + '\' nicht gefunden', 'Nicht gefunden', 'ok');
        }
      });
    }, (err) => {
          Dialogs.alert('Fehler beim scannen ' + err.message, 'Error', 'ok');
    });
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
        self.libdatalocal.store(self.users)
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
        let p = data as Array<any>;
        self.users = p.sort((n1, n2) => n1.name.localeCompare( n2.name));
      }) 
      ;
  }

  onInput(search) {
    console.log('onInput');

    let self = this;
    return self.loadLocalDB()
      .then(function () {
        if (self.searchfilter != null && self.searchfilter.length > 0) {

          let result = self.users.filter(function (user) {
            return user.name.toLowerCase().indexOf(self.searchfilter.toLowerCase()) >= 0 ||
              user.userId.toString() === self.searchfilter;
          });
          self.users = result;
        }
      });
  }

  onCancel(event) {
    console.log('onCancel');
    // seems to be softkeyboardbutton

    if (event.x + event.y === 0 && event.type === 'click')
      return;
    Keyboard.close();
  }

  closeKb() {
    console.log('closeKb()');
    Keyboard.close();
    return false;
  }
}