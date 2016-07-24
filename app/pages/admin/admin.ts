import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {AppVersion} from "ionic-native";




let PouchDB = require("pouchdb");

@Component({
  templateUrl: "build/pages/admin/admin.html",
})


export class AdminPage {
  selectedItem: any;
  DbInfos: Array<any>;
  appname: string;
  appversion: string;
  appversionnumber: string;
  appversioncode: string;
  constructor(private nav: NavController, navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.getDBInfos();

    try {

      AppVersion.getAppName().then(d => this.appname = d).catch();
      AppVersion.getPackageName().then(d => this.appversion = d).catch();
      AppVersion.getVersionCode().then(d => this.appversioncode = d).catch();
      AppVersion.getVersionNumber().then(d => this.appversionnumber = d).catch();
    } catch (err) { }
  }

  getDBInfos() {

    this.DbInfos = [];
    this.getDBInfo("libtutDB").then(data => { this.DbInfos.push(data); });
    this.getDBInfo("libtutDB_details").then(data => { this.DbInfos.push(data); });
    // this.getDBInfo('libtutDB_users').then(data => { this.DbInfos.push(data); })
  }
  getDBInfo(dbname: string) {
    let pouchDb = new PouchDB(dbname, { adapter: "websql" });
    return pouchDb.info();


  }
  deleteListDB(dbname: string) {
    let self = this;
    let pouchDb = new PouchDB(dbname, { adapter: "websql" });
    console.log("PouchDB: " + pouchDb.adapter);
    pouchDb.destroy()
      .then(console.log(dbname + " deleted"))
      .then(
      // self.getDBInfos()
      );
  }


}