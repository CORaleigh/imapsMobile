import {
  Component,
  ViewChild
} from '@angular/core';
import {
  NavController,
  NavParams,
  Events,
  Slides,
  Content,
  PopoverController,
  ModalController
} from 'ionic-angular';
import {
  PropertySearchProvider
} from '../../providers/property-search/property-search';
import {
  InfoPopoverPage
} from '../info-popover/info-popover';
import {
  AddressesPage
} from '../addresses/addresses';
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  account: any;
  fields: any = [];
  photos: any;
  deeds: any;
  addresses: any;
  showPhotos: boolean = false;
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private propertySearch: PropertySearchProvider, public popoverCtrl: PopoverController, public modalCtrl: ModalController) {

    this.account = navParams.data.data.account;
    this.fields = this.setFields(navParams.data.data.fields);
    this.getPhotos(this.account.reid);
    this.getDeeds(this.account.reid);
    events.subscribe('change-tab-info', (tab, data) => {
      this.content.scrollToTop();
      console.log(data);
      this.account = data.account;
      this.fields = this.setFields(data.fields);
      this.getPhotos(this.account.reid);
      this.getDeeds(this.account.reid);
    });
  }
  setFields(fields) {
    let result = [];
    this.fields = [];
    fields.forEach((field, index) => {
      if (field.field != 'mailAddress2' && field.field != 'mailAddress3') {
        result.push(field);
      }
    });
    return result;
  }
  getPhotos(reid: string) {
    let photoSearch = this.propertySearch.getPhotos(reid).subscribe(results => {
      this.photos = results.Photos;
      if (this.slides) {
        this.slides.slideTo(0);
      }
      this.showPhotos = this.photos.length > 0;
      photoSearch.unsubscribe();
    })
  }
  getDeeds(reid: string) {
    let deedSearch = this.propertySearch.getDeeds(reid).subscribe(results => {
      this.deeds = results.Deeds;
      deedSearch.unsubscribe();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }
  showActions(evt) {
    let popover = this.popoverCtrl.create(InfoPopoverPage, this.account);
    popover.present({
      ev: evt
    });
    popover.onDidDismiss(data => {
      if (data) {
        if (data.addresses) {
          let modal = this.modalCtrl.create(AddressesPage, data);
          modal.present();
        }
      }
    });
  }
}