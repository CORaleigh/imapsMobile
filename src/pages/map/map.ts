import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import {
  EsriLoaderService
} from 'angular2-esri-loader';
import {
  LayerListPage
} from '../layer-list/layer-list';
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [EsriLoaderService]
})
export class MapPage implements OnInit {
  @ViewChild('map') mapEl: ElementRef;
  map: any;
  layerList: any;
  loaded: boolean = false;
  constructor(public navCtrl: NavController, private esriLoader: EsriLoaderService) {}
  goToLayerList() {
    this.navCtrl.push(LayerListPage, {
      map: this.map,
      LayerList: this.layerList
    });
  }
  ngOnInit() {
    this.esriLoader.load({
      url: 'https://js.arcgis.com/3.21/'
    }).then(() => {
      this.esriLoader.loadModules(['esri/map', 'esri/arcgis/utils', 'esri/geometry/Point', 'esri/dijit/LayerList']).then(([Map, arcgisUtils, Point, LayerList]) => {
        var page = this;
        this.layerList = LayerList;
        arcgisUtils.createMap("dc14a00c3e4d474c9338f6b1e03234cd", this.mapEl.nativeElement, {
          mapOptions: {
            slider: false
          }
        }).then(function (response) {
          page.map = response.map;
          page.loaded = true;
        });
      });
    });
  }
}
