import {
  Component,
  OnInit
} from '@angular/core';
import {
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import {
  EsriLoaderService
} from 'angular2-esri-loader';
import {
  PropertySearchProvider
} from '../../providers/property-search/property-search';
@Component({
  selector: 'page-basemap',
  templateUrl: 'basemap.html',
})
export class BasemapPage implements OnInit {
  map: any;
  basemapGallery: any;
  basemaps: any;
  selectedBasemap: any;

  ngOnInit() {
    this.esriLoader.load({
      url: 'https://js.arcgis.com/3.21/'
    }).then(() => {
      this.esriLoader.loadModules([
        'esri/arcgis/Portal'
      ]).then(([arcgisPortal]) => {
        let portalUrl = 'https://ral.maps.arcgis.com';
        let portal = new arcgisPortal.Portal(portalUrl);
        portal.on('load', () => {
          portal.queryGroups({
            q: 'bfcbea38380847808c947538a99a2f54'
          }).then((data) => {
            let group = data.results[0];
            group.queryItems({num:20, sortField: 'title', sortOrder: 'desc'}).then((data) => {
              this.basemaps = data.results;
            })
          });
        });
      });
      // this.esriLoader.loadModules([
      //   'esri/dijit/BasemapGallery'
      // ]).then(([BasemapGallery]) => {
      //   this.basemapGallery = new BasemapGallery({
      //     showArcGISBasemaps: true,
      //     map: this.map,
      //     portalUrl: "http://ral.maps.arcgis.com",
      //     basemapsGroup: {
      //       owner: 'justin.greco@raleighnc.gov_ral',
      //       name: 'Esri Vector Tiles Basemaps',
      //       id: '5e4b1873eeed4e448aca4bf930df0cd0'
      //     }
      //   }, "basemapGallery");
      //   this.basemapGallery.startup();
      // });
    });
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, private esriLoader: EsriLoaderService, public viewCtrl: ViewController, public propertySearch: PropertySearchProvider) {
    this.map = navParams.data.map;

  }


  getBasemapInfo(data) {
    let page = this;
    this.esriLoader.loadModules([
      'esri/dijit/BasemapLayer',
      'esri/dijit/Basemap',
      "esri/basemaps",
      "esri/layers/VectorTileLayer"
    ]).then(([BasemapLayer, Basemap, esriBasemaps, VectorTileLayer]) => {
      let basemap = {
        title: page.selectedBasemap.title,
        thumbnailUrl: page.selectedBasemap.thumbnailUrl,
        itemId: page.selectedBasemap.id,
        baseMapLayers: []
      };
      data.baseMap.baseMapLayers.forEach(layer => {
        if (layer.styleUrl) {
          basemap.baseMapLayers.push({
            url: layer.styleUrl,
            "type": "VectorTile"
          });
        } else {
          basemap.baseMapLayers.push({
            url: layer.url
          });
        }
      });
      esriBasemaps[data.baseMap.title] = basemap;
      if (page.map.getBasemap() === "") {
        page.map.removeLayer(page.map.getLayer(page.map.layerIds[0]));
      }
      page.map.setBasemap(basemap);
      page.dismiss();
    });
  }
  setBasemap(basemap) {
    this.selectedBasemap = basemap;

    this.propertySearch.getBaseMapInfo(basemap.itemDataUrl).subscribe((data) => {
      this.getBasemapInfo(data)
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BasemapPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
