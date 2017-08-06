import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PropertySearchProvider } from '../../providers/property-search/property-search';
/**
 * Generated class for the LegendPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-legend',
  templateUrl: 'legend.html',
})
export class LegendPage {
  infos: Array<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public propertySearch: PropertySearchProvider, public viewCtrl: ViewController) {
    propertySearch.getLayerLegend(navParams.data.url).subscribe(response => {
      this.infos = response.layers[navParams.data.id].legend;
      
    });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LegendPage');
  }

}