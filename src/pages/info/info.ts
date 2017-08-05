import { Component } from '@angular/core';
import { NavController, NavParams,  Events } from 'ionic-angular';
import { PropertySearchProvider } from '../../providers/property-search/property-search';
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  account: any;
  fields: any;
  photos: any;
  deeds: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events, private propertySearch: PropertySearchProvider) {
    this.account = navParams.data.data.account;
    this.fields = navParams.data.data.fields;
    this.getPhotos(this.account.reid);
    this.getDeeds(this.account.reid); 
    events.subscribe('change-tab-info', (tab, data) => {
      console.log(data);
      this.account = data.account;
      this.fields = data.fields;
      this.getPhotos(this.account.reid);    
      this.getDeeds(this.account.reid); 
    });  
}
  getPhotos(reid:string) {
    this.propertySearch.getPhotos(reid).subscribe(results => {
      this.photos = results.Photos;
    })
  }
  getDeeds(reid:string) {
    this.propertySearch.getDeeds(reid).subscribe(results => {
      this.deeds = results.Deeds;
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

}
