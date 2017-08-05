import {
  Component
} from '@angular/core';
import {
  ViewController
} from 'ionic-angular';
@Component({
  selector: 'page-map-menu',
  templateUrl: 'map-menu.html',
})
export class MapMenuPage {
  constructor(public viewCtrl: ViewController) {}
  ionViewDidLoad() {
    console.log('ionViewDidLoad MapMenuPage');
  }
}
