import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {
  EsriLoaderService
} from 'angular2-esri-loader';
/**
 * Generated class for the BasemapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-basemap',
  templateUrl: 'basemap.html',
})
export class BasemapPage implements OnInit, OnDestroy {
  map: any;
  basemapGallery: any;
  ngOnDestroy() {
    this.basemapGallery.destroy();
  }
  ngOnInit() {
    this.esriLoader.load({
      url: 'https://js.arcgis.com/3.21/'
    }).then(() => {
      this.esriLoader.loadModules([
        'esri/dijit/BasemapGallery'
      ]).then(([BasemapGallery]) => {
        this.basemapGallery = new BasemapGallery({
          showArcGISBasemaps: true,
          map: this.map,
          portalUrl: "http://ral.maps.arcgis.com",
          basemapsGroup: {
            owner: 'justin.greco@raleighnc.gov_ral',
            name: 'Esri Vector Tiles Basemaps',
            id: '5e4b1873eeed4e448aca4bf930df0cd0'
          }
        }, "basemapGallery");      
        this.basemapGallery.startup();
      });    
  });
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, private esriLoader: EsriLoaderService) {
    this.map = navParams.data.map;
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BasemapPage');
  }

}
