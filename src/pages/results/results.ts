import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams,
  Events
} from 'ionic-angular';
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {
  accounts: any;
  fields: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events) {
    this.accounts = navParams.data.data.accounts;
    this.fields = navParams.data.data.fields;
    events.subscribe('change-tab', (tab, data) => {
      this.accounts = data.accounts;
      this.fields = data.fields;
    });
  }
  goToInfo(account: any) {
    this.events.publish('change-tab-info', 2, {
      account: account,
      fields: this.fields
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultsPage');
  }

}
