import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams,
  ViewController,
  ModalController
} from 'ionic-angular';
import {
  LegendPage
} from '../legend/legend';

@Component({
  selector: 'page-layer',
  templateUrl: 'layer.html',
})
export class LayerPage {
  layer;
  opacity;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtl: ModalController) {
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
    layer.setVisibleLayers(layer.visibleLayers);
  }

  showLegend(info, layer) {
    let modal = this.modalCtl.create(LegendPage, {
      url: layer.url + '/legend',
      id: info.id
    });
    modal.present();
  }
}

