import {
  Injectable
} from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions
} from '@angular/http';
import {
  Observable
} from 'rxjs/Rx';

import 'rxjs/add/operator/map';

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
  getLayerLegend(url: string): Observable < any > {
    return this.http.get(url + '?f=json')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
