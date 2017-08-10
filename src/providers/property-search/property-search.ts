import {
  Injectable
} from '@angular/core';
import {
  Http,
  Response
} from '@angular/http';
import {
  Observable
} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class PropertySearchProvider {

  constructor(public http: Http) {}
  private apiUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer/exts/PropertySOE';
  getAutocomplete(input: string, type: string): Observable < any > {
    return this.http.get(this.apiUrl + '/AutoComplete?f=json&input=' + input + '&type=' + type)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  }
  getPropertyInfo(values: string, type: string): Observable < any > {
    return this.http.get(this.apiUrl + '/RealEstateSearch?f=json&limit=5&values=' + JSON.stringify([values]) + '&type=' + type)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  }
  getPhotos(reid: string): Observable < any > {
    return this.http.get(this.apiUrl + '/PhotoSearch?f=json&reid=' + reid)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  }
  getDeeds(reid: string): Observable < any > {
    return this.http.get(this.apiUrl + '/DeedSearch?f=json&reid=' + reid)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  }
  getAddresses(pin: string, reid: string): Observable < any > {
    return this.http.get(this.apiUrl + '/AddressSearch?f=json&reid=' + reid + '&pin=' + pin)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  }
  getLayerLegend(url: string): Observable < any > {
    return this.http.get(url + '?f=json')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  getBaseMapInfo(url: string): Observable < any > {
    return this.http.get(url + '?f=json')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  // getServicesResults (url: string) {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(url+'?f=json').subscribe(results => resolve(results));
  //   });   
  // }
  // getServicesJson () : Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get('../../assets/services.json').subscribe(results => resolve(results));
  //   });
  // }
  // getServices ():  Promise<any> {
  //   let results = this.getServicesJson().then(results => {
  //     this.getServicesResults(results.json().url)
  //   });
  //   return results;
  // }
}
