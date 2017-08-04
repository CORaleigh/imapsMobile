import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';

/*
  Generated class for the PropertySearchProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PropertySearchProvider {

  constructor(public http: Http) {}
  private apiUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer/exts/PropertySOE'; 
  getAutocomplete(input: string, type: string) : Observable<any>{
      // ...using get request
      return this.http.get(this.apiUrl + '/AutoComplete?f=json&limit=5&input=' + input + '&type=' + type)
                    // ...and calling .json() on the response to return data
                      .map((res:Response) => res.json())
                      //...errors if any
                      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    
  }
  getPropertyInfo(values: string, type: string) : Observable<any>{
      // ...using get request
      return this.http.get(this.apiUrl + '/RealEstateSearch?f=json&limit=5&values=' + JSON.stringify([values]) + '&type=' + type)
                    // ...and calling .json() on the response to return data
                      .map((res:Response) => res.json())
                      //...errors if any
                      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    
  }  
  getPhotos(reid: string) : Observable<any>{
      // ...using get request
      return this.http.get(this.apiUrl + '/PhotoSearch?f=json&reid=' + reid)
                    // ...and calling .json() on the response to return data
                      .map((res:Response) => res.json())
                      //...errors if any
                      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    
  }    
  getDeeds(reid: string) : Observable<any>{
      // ...using get request
      return this.http.get(this.apiUrl + '/DeedSearch?f=json&reid=' + reid)
                    // ...and calling .json() on the response to return data
                      .map((res:Response) => res.json())
                      //...errors if any
                      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    
  }    
}
