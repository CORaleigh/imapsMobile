import {
  Component
} from '@angular/core';
import {
  Platform
} from 'ionic-angular';
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
  isTablet: boolean;
  constructor(public platform: Platform) {
    this.isTablet = this.platform.is('tablet') || this.platform.is('core');
  }
}
