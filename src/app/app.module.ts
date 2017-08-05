import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { MapPage } from '../pages/map/map';
import { InfoPage } from '../pages/info/info';
import { ResultsPage } from '../pages/results/results';
import { SearchProvider } from '../providers/search/search';
import { PropertySearchProvider } from '../providers/property-search/property-search';
import { EsriLoaderService } from 'angular2-esri-loader';
import { LayerListPage } from '../pages/layer-list/layer-list';
import { Geolocation } from '@ionic-native/geolocation';
import { LayerPage } from '../pages/layer/layer';
import { LayerFilterPipe } from '../pipes/layer-filter/layer-filter';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
    MapPage,
    InfoPage,
    ResultsPage,
    LayerListPage,
    LayerPage,
    LayerFilterPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    MapPage,
    InfoPage,
    ResultsPage,
    LayerListPage,
    LayerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SearchProvider,
    PropertySearchProvider,
    EsriLoaderService,
    Geolocation
  ]
})
export class AppModule {}
