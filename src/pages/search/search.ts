import { Component } from '@angular/core';
import { NavController, NavParams, Tabs, Events } from 'ionic-angular';
import { PropertySearchProvider } from '../../providers/property-search/property-search';
import {FormControl} from '@angular/forms';
import { InfoPage } from '../info/info';


/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  searchInput: any;
  searchControl = new FormControl();
  addresses: any = [];
  pins: any = [];
  reids: any = [];
  owners: any = [];
  accounts: any = [];
  streets: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private propertySearch: PropertySearchProvider, private events: Events) {
  }

  ngOnInit() {
      this.searchControl.valueChanges
        .debounceTime(1000)
        .subscribe(newValue => {if (newValue){this.getData(newValue);}});

  }

  getData(value) {
    this.propertySearch.getAutocomplete(value, 'address').subscribe(results => {this.addresses = results.Results.slice(0,5)})
    this.propertySearch.getAutocomplete(value, 'owner').subscribe(results => {this.owners = results.Results.slice(0,5)})
    this.propertySearch.getAutocomplete(value, 'pin').subscribe(results => {this.pins = results.Results.slice(0,5)})
    this.propertySearch.getAutocomplete(value, 'reid').subscribe(results => {this.reids = results.Results.slice(0,5)})
    this.propertySearch.getAutocomplete(value, 'street name').subscribe(results => {this.streets = results.Results.slice(0,5)})    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  searchProperty(value, type) {
    // this.searchInput = value;
    // this.propertySearch.getAutocomplete(value, 'address').subscribe(results => console.log(results));
    this.propertySearch.getPropertyInfo(value, type).subscribe(results => {
      this.accounts = results.Accounts;
      // this.navCtrl.parent.accounts = this.accounts;
      // var t:Tabs = this.navCtrl.parent;
      // t.select(1);    
      if (this.accounts.length > 1) {
        this.events.publish('change-tab', 1, {accounts: this.accounts, fields: results.Fields});
      }  else if (this.accounts.length === 1) {
        this.events.publish('change-tab-info', 2, {account: this.accounts[0], fields: results.Fields});
      }
      
    });
    //this.navCtrl.push(InfoPage);

  };

}
