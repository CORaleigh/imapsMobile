import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';

/**
 * Generated class for the LayerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-layer',
  templateUrl: 'layer.html',
})
export class LayerPage {
  layer;
  opacity;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.layer = this.navParams.data;
    console.log(this.layer);
    this.opacity = this.layer.opacity * 100;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LayerPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  opacityChanged(evt) {
    this.layer.setOpacity(this.opacity / 100);
  }
  subLayerVisibilityChanged(evt, id, layer) {
    if (evt) {
      if (layer.visibleLayers.indexOf(-1) > -1) {
        layer.visibleLayers.splice(layer.visibleLayers.indexOf(-1), 1);
      }
      layer.visibleLayers.push(id);
    } else {

      layer.visibleLayers.splice(id, 1);
      if (layer.visibleLayers.length === 0) {
        layer.visibleLayers.push(-1);
      }
    }
    console.log(layer.visibleLayers)
    layer.setVisibleLayers(layer.visibleLayers);
  }
}
