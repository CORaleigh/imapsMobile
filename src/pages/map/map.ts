import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Events, PopoverController } from 'ionic-angular';
import { EsriLoaderService } from 'angular2-esri-loader';
import { PropertySearchProvider } from '../../providers/property-search/property-search';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  public mymap: any;
    // for JSAPI 4.x you can use the "any for TS types
  public mapView: any;//__esri.MapView;
  public pointGraphic: any;//__esri.Graphic;
  public markerSymbol: any;//__esri.SimpleMarkerSymbol;
  public graphicsLayer: any;//__esri.GraphicsLayer;
  public findTask: any;//__esri.FindTask;
  public findParameters: any;//__esri.FindParameters;
  public pin: string;
  public spatialReference: any;//__esri.SpatialReference;
  public fillSymbol: any;//__esri.SimpleFillSymbol;
  public query: any;//__esri.Query;
  public queryTask: any;//__esri.QueryTask;
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  maploaded: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private esriLoader: EsriLoaderService, private events: Events, public popoverCtrl: PopoverController, private propertySearch: PropertySearchProvider, public geolocation: Geolocation) {
    if(navParams.data.data) {
      console.log(navParams.data.data.account);
      this.pin = navParams.data.data.account.pin;
    }
    events.subscribe('change-tab-info', (tab, data) => {
      console.log(navParams.data.data.account);
      this.pin = navParams.data.data.account.pin;
      this.findProperty(this.pin);
    });    
  }


  public findProperty(pin: string) {
    this.findParameters.layerIds = [0, 1];
    this.findParameters.searchFields = ['PIN_NUM'];
    this.findParameters.searchText = pin;
    this.findParameters.returnGeometry = true;
    this.findParameters.outSpatialReference = this.spatialReference;
    console.log(this.spatialReference);
  
    this.findTask.url = 'https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer';
    this.findTask.execute(this.findParameters).then(response => {
      if (response.results.length > 0) {
        response.results[0].feature.symbol = this.fillSymbol;
        this.mapView.graphics.removeAll();
        this.mapView.graphics.add(response.results[0].feature);
        this.mapView.goTo(response.results[0].feature);
      }
    });
  }

  public findPropertyPin(point) {
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
    });
  }

  public findPropertyInfo(pin: string) {
    this.propertySearch.getPropertyInfo(pin, 'pin').subscribe(results => {
      let accounts = results.Accounts;
      // this.navCtrl.parent.accounts = this.accounts;
      // var t:Tabs = this.navCtrl.parent;
      // t.select(1);    
      if (accounts.length > 1) {
        this.events.publish('change-tab', 1, {accounts: accounts, fields: results.Fields});
      }  else if (accounts.length === 1) {
        this.events.publish('change-tab-info', 2, {account: accounts[0], fields: results.Fields});
      }
    });
  }
  @ViewChild('mapViewNode') mapEl: ElementRef;
  public ngOnInit() {
    return this.buildMap();
    
  }

  buildMap() {
        return this.esriLoader.load({
      url: 'https://js.arcgis.com/3.20/'
    }).then(() => {
      this.esriLoader.loadModules(['esri/map'

      ]).then(([Map

      ]) => {
          let map = new Map(this.mapEl.nativeElement, {
          center: [-118, 34.5],
          zoom: 8,
          basemap: "gray-vector"
        });
      });
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }


}
