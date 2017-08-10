import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  NavController,
  Events,
  NavParams,
  LoadingController,
  ModalController,
  Platform
} from 'ionic-angular';
import {
  EsriLoaderService
} from 'angular2-esri-loader';
import {
  LayerListPage
} from '../layer-list/layer-list';
import {
  BasemapPage
} from '../basemap/basemap';
import {
  PropertySearchProvider
} from '../../providers/property-search/property-search';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [EsriLoaderService]
})
export class MapPage implements OnInit {
  @ViewChild('map') mapEl: ElementRef;
  map: any;
  opLayers: Array < string > = [];
  layerList: any;
  loaded: boolean = false;
  pin: string = null;
  findParameters: any;
  find: any;
  query: any;
  queryTask: any;
  fillSymbol: any;
  spatialReference: any;
  agolPopupClickHandle: any;
  agolPopupclickEventListener: any;
  screenUtils: any;
  screenPoint: any;
  basemapGallery: any;
  loading: any;
  isTablet: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private esriLoader: EsriLoaderService, private events: Events, private propertySearch: PropertySearchProvider, public loadingCtrl: LoadingController, public modalCtl: ModalController, public platform: Platform) {
    this.isTablet = this.platform.is('tablet') || this.platform.is('core');
    if (navParams.data.data) {
      this.pin = navParams.data.data.account.pin;
    }
    events.subscribe('change-tab-info', (tab, data) => {
      if (data) {
        this.pin = data.account.pin;
        if (this.map) {
          this.findProperty(this.pin, this.findParameters, this.find, this.fillSymbol);
        }
      }
    });
  }
  goToLayerList() {
    let modal = this.modalCtl.create(LayerListPage, {
      map: this.map,
      opLayers: this.opLayers
    });
    modal.present();
  }
  goToBasemap() {
    let modal = this.modalCtl.create(BasemapPage, {
      map: this.map,
    });
    modal.present();
  }
  findPropertyInfo(pin: string) {
    this.propertySearch.getPropertyInfo(pin, 'pin').subscribe(results => {
      let accounts = results.Accounts;
      if (accounts.length > 1) {
        this.events.publish('change-tab', 1, {
          accounts: accounts,
          fields: results.Fields
        });
      } else if (accounts.length === 1) {
        this.events.publish('change-tab-info', 2, {
          account: accounts[0],
          fields: results.Fields
        });
      }
      this.loading.dismiss();
    });
  }
  findProperty(pin: string, findParameters, findTask, fillSymbol) {
    findParameters.layerIds = [0, 1];
    findParameters.searchFields = ['PIN_NUM'];
    findParameters.searchText = pin;
    findParameters.returnGeometry = true;
    findParameters.outSpatialReference = this.spatialReference;
    console.log(this.spatialReference);

    findTask.execute(findParameters).then(results => {
      if (results.length > 0) {
        results[0].feature.symbol = fillSymbol;
        this.map.graphics.clear();
        this.map.graphics.add(results[0].feature);
        this.map.setExtent(results[0].feature.geometry.getExtent().expand(2), true);
      }
    });
  }
  findPropertyPin(point) {
    this.queryTask.url = 'https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer/0';
    this.query.geometry = point;
    this.query.outSpatialReference = this.spatialReference;
    this.query.outFields = ['PIN_NUM'];
    this.query.where = '1=1';
    this.queryTask.execute(this.query).then(response => {
      if (response.features.length > 0) {
        this.pin = response.features[0].attributes.PIN_NUM;
        this.findPropertyInfo(this.pin);
      } else {
        this.queryTask.url = 'https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer/1';
        this.queryTask.execute(this.query).then(response => {
          if (response.features.length > 0) {
            this.pin = response.features[0].attributes.PIN_NUM;
            this.findPropertyInfo(this.pin);
          } else {
            this.loading.dismiss();
          }
        })
      }
      if (this.isTablet) {
        this.findProperty(this.pin, this.findParameters, this.find, this.fillSymbol);
      }
    }, error => {});

  }

  mapPress(evt) {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    this.loading.present();
    this.screenPoint.x = evt.srcEvent.layerX;
    this.screenPoint.y = evt.srcEvent.layerY;
    let width = evt.target.clientWidth;
    let height = evt.target.clientHeight;
    let point = this.screenUtils.toMapGeometry(this.map.extent, width, height, this.screenPoint);
    if (this.agolPopupClickHandle) {
      this.agolPopupClickHandle.remove();
      this.agolPopupClickHandle = null;
    }
    this.findPropertyPin(point);
  }

  ngOnInit() {

    this.esriLoader.load({
      url: 'https://js.arcgis.com/3.21/'
    }).then(() => {
      this.esriLoader.loadModules([
        'esri/map',
        'esri/arcgis/utils',
        'esri/geometry/Point',
        'esri/dijit/LayerList',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/tasks/FindTask',
        'esri/tasks/FindParameters',
        'esri/symbols/SimpleFillSymbol',
        'esri/SpatialReference',
        'esri/dijit/LocateButton',
        "esri/geometry/screenUtils",
        "esri/geometry/ScreenPoint",
        'esri/dijit/BasemapGallery',
        "esri/config",
        "esri/tasks/GeometryService"
      ]).then(([Map, arcgisUtils, Point, LayerList, Query, QueryTask, FindTask, FindParameters, SimpleFillSymbol, SpatialReference, LocateButton, screenUtils, ScreenPoint, BasemapGallery, esriConfig, GeometryService]) => {
        let page = this;
        esriConfig.defaults.geometryService = new GeometryService("https://maps.raleighnc.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");
        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true
        });
        this.loading.present();
        this.screenUtils = screenUtils;
        this.screenPoint = new ScreenPoint();
        this.spatialReference = new SpatialReference(3857);
        this.findParameters = new FindParameters();

        this.find = new FindTask('https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer');
        this.fillSymbol = new SimpleFillSymbol({
          "color": [
            255,
            255,
            255,
            0
          ],
          "outline": {
            "color": [
              255,
              0,
              0,
              255
            ],
            "width": 2.25,
            "type": "esriSLS",
            "style": "esriSLSSolid",
            "marker": null
          },
          "type": "esriSFS",
          "style": "esriSFSSolid"
        });
        this.query = new Query();
        this.queryTask = new QueryTask('https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer/0');
        this.layerList = LayerList;
        if (this.pin && this.map) {
          this.findProperty(this.pin, this.findParameters, this.find, this.fillSymbol);
        }
        arcgisUtils.createMap("ae9528a8e6e64994b4596072dcc476b8", this.mapEl.nativeElement, {
          mapOptions: {
            slider: false,
            minZoom: 11,
            zoom: 11
          }
        }).then(function (response) {
          console.log(response);
          response.itemInfo.itemData.operationalLayers.forEach(opLayer => {
            page.opLayers.push(opLayer.id);
          });
          page.map = response.map;
          page.agolPopupClickHandle = response.clickEventHandle;
          page.agolPopupclickEventListener = response.clickEventListener;
          if (page.pin) {
            page.findProperty(page.pin, page.findParameters, page.find, page.fillSymbol);
          }
          page.loaded = true;
          page.loading.dismiss();
          let timeout = null;
          var geoLocate = new LocateButton({
            map: page.map,
            highlightLocation: true,
            useTracking: true,
            scale: 2000
          }, "LocateButton");
          geoLocate.on('load', () => {
            console.log('geolocate loaded');
            geoLocate.show();
          });
          geoLocate.startup();
          page.map.on('mouse-up', (evt) => {
            if (!page.agolPopupClickHandle) {
              page.agolPopupClickHandle = page.map.on("click", page.agolPopupclickEventListener);
            }
            if (timeout) {
              clearTimeout(timeout);
            }
          });
        });
      });
    });
  }
}
