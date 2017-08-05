import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  NavController,
  Events,
  NavParams
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private esriLoader: EsriLoaderService, private events: Events, private propertySearch: PropertySearchProvider) {
    if (navParams.data.data) {
      this.pin = navParams.data.data.account.pin;
    }
    events.subscribe('change-tab-info', (tab, data) => {
      this.pin = navParams.data.data.account.pin;
      if (this.map) {
        this.findProperty(this.pin, this.findParameters, this.find, this.fillSymbol);
      }
    });
  }
  goToLayerList() {
    this.navCtrl.push(LayerListPage, {
      map: this.map,
      opLayers: this.opLayers
    });
  }
  goToBasemap() {
    this.navCtrl.push(BasemapPage, {
      map: this.map
    });
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
        this.findPropertyInfo(response.features[0].attributes.PIN_NUM);
      } else {
        this.queryTask.url = 'https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer/1';
        this.queryTask.execute(this.query).then(response => {
          if (response.features.length > 0) {
            this.findPropertyInfo(response.features[0].attributes.PIN_NUM);
          }
        })
      }
    }, error => {});

  }

  mapPress(evt) {
    this.screenPoint.x = evt.center.x;
    this.screenPoint.y = evt.center.y;
    let point = this.screenUtils.toMapGeometry(this.map.extent, this.map.width, this.map.height, this.screenPoint);
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
        'esri/dijit/BasemapGallery'
      ]).then(([Map, arcgisUtils, Point, LayerList, Query, QueryTask, FindTask, FindParameters, SimpleFillSymbol, SpatialReference, LocateButton, screenUtils, ScreenPoint, BasemapGallery]) => {
        let page = this;
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
        arcgisUtils.createMap("dc14a00c3e4d474c9338f6b1e03234cd", this.mapEl.nativeElement, {
          mapOptions: {
            slider: false
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
          let timeout = null;
          var geoLocate = new LocateButton({
            map: page.map,
            highlightLocation: true,
            useTracking: true
            }, "LocateButton"
          );
          geoLocate.on('load', () => {
            console.log('geolocate loaded');
            geoLocate.show();
          });          
          geoLocate.startup();

          // page.map.on('mouse-down', (evt) => {
          //   //connect editor
          //   if (page.agolPopupClickHandle) {
          //     page.agolPopupClickHandle.remove();
          //     page.agolPopupClickHandle = null;
          //   }
          //   timeout = setTimeout(() => {
          //     page.findPropertyPin(evt.mapPoint);
          //   }, 1000);
          // });
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
