import {
  Injectable
} from '@angular/core';
import {
  Http
} from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class ServicesProvider {

  constructor(public http: Http) {
    console.log('Hello ServicesProvider Provider');
  }
  getServicesJson() {
    return new Promise((resolve, reject) => {
      this.http.get('../../assets/services.json').subscribe(results => resolve(results));
    });
  }
  getServices() {
    let results = this.getServices();
    console.log(results)
  }

}
