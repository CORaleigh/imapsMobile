import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';

@Component({
  selector: 'page-addresses',
  templateUrl: 'addresses.html',
})
export class AddressesPage {
  addresses: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.addresses = navParams.data.addresses;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressesPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
