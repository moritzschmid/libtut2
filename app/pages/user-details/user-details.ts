import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {UserDetailData} from "../../providers/user-detail-data/user-detail-data";
import {UserDetailDataLocal} from "../../providers/user-detail-data/user-detail-data-local";
import {User}  from "../../providers/user-data/user";

@Component({
  templateUrl: "build/pages/user-details/user-details.html",
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
    this.navItem = navParams.get("item");

    this.loadLocalDB(this.navItem.userId as number);
  }


  loadLocalDB(id: number) {
    let remoteItem: any = null;
    let self = this;
    self.selectedItem = self.navItem;
    if (self.selectedItem.lends) {
      self.selectedItem.lends.forEach(element => {
        element.lenddate = new Date(element.lenddate);
      });
    }
    console.log(self.selectedItem);
  }
}
