import {
  Component,
  ViewChild,
  ElementRef,
  forwardRef,
  OnInit
} from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController
} from 'ionic-angular';
import {
  LayerPage
} from '../layer/layer';
import {
  LayerFilterPipe
} from '../../pipes/layer-filter/layer-filter';
@Component({
  selector: 'page-layer-list',
  templateUrl: 'layer-list.html'
})
export class LayerListPage implements OnInit {
  layers: Array < any > = [];
  basemapLayerIds: Array < string > ;
  ngOnInit() {
    this.navParams.data.opLayers.forEach(layerId => {
      let layer = this.navParams.data.map.getLayer(layerId);
        if (layer.arcgisProps) {
          layer.title = layer.arcgisProps.title;
        }
        this.layers.push(layer);      
    });
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtl: ModalController) {}
  ionViewDidLoad() {
    console.log('ionViewDidLoad LayerListPage');
  }
  layerVisibilityChanged(evt, layer) {
    layer.visible = !layer.visible;
    layer.setVisibility(evt);
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
  showLayerInfo(layer) {
    let modal = this.modalCtl.create(LayerPage, layer);
    modal.present();
  }
}