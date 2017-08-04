import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';

import { NavController } from 'ionic-angular';

import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [ EsriLoaderService ]
})
export class MapPage implements OnInit{

  @ViewChild('map') mapEl: ElementRef;

  constructor(public navCtrl: NavController, private esriLoader: EsriLoaderService) { }

  ngOnInit() {

    let latitude: number = 0, longitude: number = 0, map: any = null, MapPoint: any = null;

    const options = {
      enableHighAccuracy: true, // use any allowed location provider
      timeout: 60000            // it can take quite a while for a cold GPS to warm up
    };

    // Demonstrates starting up geolocation before loading ArcGIS JS API
    // You can also wait until after the map has loaded. It all depends
    // on your requirements.

    let watchId = navigator.geolocation.watchPosition( position=> {

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        centerMap(latitude, longitude);

      }, error => {

        switch(error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            alert("Unable to start geolocation. Check application settings.");
            break;
        }
      }, options
    );

    this.esriLoader.load({
      url: 'https://js.arcgis.com/3.21/'
    }).then(() => {

      this.esriLoader.loadModules(['esri/map', 'esri/arcgis/utils','esri/geometry/Point']).then(([Map, arcgisUtils, Point]) => {
        // create the map at the DOM element in this component
        // map = new Map(this.mapEl.nativeElement, {
        //   center: [-118, 34.5],
        //   zoom: 8,
        //   basemap: "gray-vector"
        // });
        arcgisUtils.createMap("dc14a00c3e4d474c9338f6b1e03234cd", this.mapEl.nativeElement).then(function (response) {
            map = response.map;
        });

        MapPoint = Point;

        // Shut off geolocation when user zooms.
        // map.on("zoom-end",function(){
        //   navigator.geolocation.clearWatch(watchId);
        //   console.log("Geolocation stopped.");
        // });

      });
    });

    // Keep centering the map until we shut off geolocation
    function centerMap(lat, lon) {
      if(map != null) {
        console.log("Centering map: " + lat + ", " + lon);
        map.centerAt(MapPoint(lon, lat));
      }
    }
  }
}