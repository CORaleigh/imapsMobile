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
  public mapView: __esri.MapView;
  public pointGraphic: __esri.Graphic;
  public markerSymbol: __esri.SimpleMarkerSymbol;
  public graphicsLayer: __esri.GraphicsLayer;
  public findTask: __esri.FindTask;
  public findParameters: __esri.FindParameters;
  public pin: string;
  public spatialReference: __esri.SpatialReference;
  public fillSymbol: __esri.SimpleFillSymbol;
  public query: __esri.Query;
  public queryTask: __esri.QueryTask;
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

  public ngOnInit() {
    return this.buildMap();
  }

  buildMap() {
        return this.esriLoader.load({
      url: 'https://js.arcgis.com/4.4/'
    }).then(() => {
      this.esriLoader.loadModules([
        'esri/WebMap',
        'esri/views/MapView',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/Graphic',
        'esri/layers/GraphicsLayer',
        'esri/tasks/FindTask',
        'esri/tasks/support/FindParameters',
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query',        
        'esri/geometry/SpatialReference',
        'esri/symbols/SimpleFillSymbol',
        'esri/widgets/BasemapGallery',
        'esri/widgets/LayerList',
        "esri/widgets/Expand",
        "esri/widgets/Track",
        "esri/widgets/Compass"
      ]).then(([
        WebMap,
        MapView,
        Point,
        SimpleMarkerSymbol,
        Graphic,
        GraphicsLayer,
        FindTask,
        FindParameters,
        QueryTask,
        Query,
        SpatialReference,
        SimpleFillSymbol,
        BasemapGallery,
        LayerList,
        Expand,
        Track,
        Compass
      ]) => {
        const mapProperties: __esri.MapProperties = {
          basemap: 'gray-vector'
        };

        const map = new WebMap({
          portalItem: { // autocasts as new PortalItem()
            id: "dc14a00c3e4d474c9338f6b1e03234cd"
          }
        });
        // const mapViewProperties: __esri.MapViewProperties = {
        //   container: this.mapViewEl.nativeElement,
        //   center: [-78.65, 35.8],
        //   zoom: 12,
        //   map
        // };
        
        let page = this;
        this.mymap = map;
        this.mapView = new MapView({map: map, container: this.mapViewEl.nativeElement});
        this.spatialReference = new SpatialReference(3857);
        this.findParameters = new FindParameters();
        this.findTask = new FindTask();
        this.fillSymbol = new SimpleFillSymbol();
        this.query = new Query();
        this.queryTask = new QueryTask();
        if (this.pin) {
          this.findProperty(this.pin);
        }
        let gallery = new BasemapGallery({
          container: document.createElement("div"),
          view: this.mapView
        });
        let layerList = new LayerList({
          container: document.createElement("div"),
          view: this.mapView
        })
        let layerListExpand = new Expand({
          expandIconClass: "esri-icon-layers",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
          // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
          view: this.mapView,
          content: layerList.domNode
        });
        this.mapView.ui.add(layerListExpand, "top-right");
        let bgExpand = new Expand({
          expandIconClass: "esri-icon-basemap",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
          // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
          view: this.mapView,
          content: gallery.domNode
        });
        this.mapView.ui.add(bgExpand, "top-right");
        let trackWidget = new Track({
          view: this.mapView
        });

        this.mapView.ui.add(trackWidget, "top-left");
        let compassWidget = new Compass({
          view: this.mapView
        });

        this.mapView.ui.add(compassWidget, "top-left");
        //this.mapView.ui.add(layerList, {position: 'top-right'});
        
       // this.maploaded = this.esriLoader.isLoaded();
      //  console.log(this.maploaded);
        this.mapView.on('hold', function (evt) {
          page.findPropertyPin(evt.mapPoint);
        });
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }


}
