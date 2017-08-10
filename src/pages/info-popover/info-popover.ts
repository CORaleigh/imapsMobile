import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PropertySearchProvider } from '../../providers/property-search/property-search';
/**
 * Generated class for the InfoPopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-info-popover',
  templateUrl: 'info-popover.html',
})
export class InfoPopoverPage {
  reid: string;
  pin: string;
  addresses: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public propertySearch: PropertySearchProvider, public viewCtrl: ViewController) {
    if (navParams.data.pin) {
      this.pin = navParams.data.pin;
    }
    if (navParams.data.reid) {
      this.reid = navParams.data.reid;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPopoverPage');
  }
  getAddresses() {
    this.propertySearch.getAddresses(this.pin, this.reid).subscribe(results => {
      this.viewCtrl.dismiss({addresses: results.Addresses});
    });
  }
  // getServices() {
  //   this.propertySearch.getServices().then(results => {
  //     console.log(results);
  //   });
  // }

}
