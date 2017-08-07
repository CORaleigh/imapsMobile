import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams,
  Events
} from 'ionic-angular';
import {
  PropertySearchProvider
} from '../../providers/property-search/property-search';
import {
  FormControl
} from '@angular/forms';

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
  numresults: any = {address: 5, pin: 5, owner: 5, reid: 5, 'street name': 5};
  constructor(public navCtrl: NavController, public navParams: NavParams, private propertySearch: PropertySearchProvider, private events: Events) {}
  ngOnInit() {
    this.searchControl.valueChanges
      .debounceTime(300)
      .subscribe(newValue => {
        if (newValue) {
          this.getData(newValue);
        } else {
          this.addresses = [];
          this.pins = [];
          this.reids = [];
          this.owners = [];
          this.accounts = [];
          this.streets = [];          
        }
      });
  }
  getData(value) {
    this.propertySearch.getAutocomplete(value, 'address').subscribe(results => {
      this.addresses = results.Results;//.slice(0, 5)
    })
    this.propertySearch.getAutocomplete(value, 'owner').subscribe(results => {
      this.owners = results.Results;//.slice(0, 5);
    })
    this.propertySearch.getAutocomplete(value, 'pin').subscribe(results => {
      this.pins = results.Results;//.slice(0, 5)
    })
    this.propertySearch.getAutocomplete(value, 'reid').subscribe(results => {
      this.reids = results.Results;//.slice(0, 5)
    })
    this.propertySearch.getAutocomplete(value, 'street name').subscribe(results => {
      this.streets = results.Results;//.slice(0, 5)
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  searchProperty(value, type) {
    this.propertySearch.getPropertyInfo(value, type).subscribe(results => {
      this.accounts = results.Accounts;
      if (this.accounts.length > 1) {
        this.events.publish('change-tab', 1, {
          accounts: this.accounts,
          fields: results.Fields
        });
      } else if (this.accounts.length === 1) {
        this.events.publish('change-tab-info', 2, {
          account: this.accounts[0],
          fields: results.Fields
        });
      }
      this.addresses = [];
      this.pins = [];
      this.reids = [];
      this.owners = [];
      this.accounts = [];
      this.streets = [];          
    });
  };
  showMore(type) {
    this.numresults[type] = 20;
  }
  showLess(type) {
    this.numresults[type] = 5;
  }  
}
