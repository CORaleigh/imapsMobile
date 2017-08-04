import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';

/**
 * Generated class for the MapMenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-map-menu',
  templateUrl: 'map-menu.html',
})
export class MapMenuPage {

  constructor(public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapMenuPage');
  }

}
