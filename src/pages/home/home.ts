import { Component, ViewChild } from '@angular/core';
import { NavController, Events, Tabs } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { MapPage } from '../map/map';
import { InfoPage } from '../info/info';
import { ResultsPage } from '../results/results';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  searchTab: any;
  mapTab: any;
  infoTab: any;
  resultsTab: any;
  tabParams: any = {};
  @ViewChild(Tabs) tabs: Tabs;
  constructor(public navCtrl: NavController, private events: Events) {
    this.searchTab = SearchPage;
    this.mapTab = MapPage;
    this.resultsTab = ResultsPage;
    this.infoTab = InfoPage;
    events.subscribe('change-tab', (tab, data) => {
      this.tabParams.data = data;
      this.tabs.getByIndex(tab).enabled = true;
      this.tabs.select(tab);
    });  
    events.subscribe('change-tab-info', (tab, data) => {
      this.tabParams.data = data;
      this.tabs.getByIndex(tab).enabled = true;
      this.tabs.select(tab);
    });       
  }

}
