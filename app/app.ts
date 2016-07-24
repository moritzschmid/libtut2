import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';
import {ProductsPage} from './pages/products/products';
import {UsersPage} from './pages/users/users';
import {AdminPage} from './pages/admin/admin';
import {Splashscreen} from 'ionic-native';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = ProductsPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    private platform: Platform,
    private menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Products', component: ProductsPage },
      { title: 'Users', component: UsersPage },
      // { title: "Info", component: HelloIonicPage },
      { title: 'Admin', component: AdminPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleLightContent();
      Splashscreen.hide();

      // if ("serviceWorker" in navigator)
      // { 
      //   navigator.serviceWorker.register("sw.js",{scope:"/"})  
      //   .then((r) => {console.log("serviceWorker started");});    

      // }
    });
  }


  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);
