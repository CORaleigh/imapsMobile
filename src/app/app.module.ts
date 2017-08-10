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
import { PropertySearchProvider } from '../providers/property-search/property-search';
import { EsriLoaderService } from 'angular2-esri-loader';
import { LayerListPage } from '../pages/layer-list/layer-list';
import { Geolocation } from '@ionic-native/geolocation';
import { LayerPage } from '../pages/layer/layer';
import { LegendPage } from '../pages/legend/legend';
import { BasemapPage } from '../pages/basemap/basemap';
import { LayerFilterPipe } from '../pipes/layer-filter/layer-filter';
import { OrderByPipe } from '../pipes/order-by/order-by';
import { InfoPopoverPage } from '../pages/info-popover/info-popover';
import { AddressesPage } from '../pages/addresses/addresses';
import { ServicesProvider } from '../providers/services/services';
import { SplitScreenPage } from '../pages/split-screen/split-screen';
import { PhoneScreenPage } from '../pages/phone-screen/phone-screen';
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
    LayerFilterPipe,
    BasemapPage,
    OrderByPipe,
    LegendPage,
    InfoPopoverPage,
    AddressesPage,
    SplitScreenPage,
    PhoneScreenPage
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
    LayerPage,
    BasemapPage,
    LegendPage,
    InfoPopoverPage,
    AddressesPage,
    SplitScreenPage,
    PhoneScreenPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PropertySearchProvider,
    EsriLoaderService,
    Geolocation,
    ServicesProvider
  ]
})
export class AppModule {}
