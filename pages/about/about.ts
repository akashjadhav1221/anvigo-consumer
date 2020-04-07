import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  mail() {
    window.open("mailto:alientartsoftwares@gmail.com", '_system');
  }

  web() {
    window.open("https://alienart.in", '_system');
  }

  facebook() {
    window.open("http://www.fb.com/alienartapps", '_system', 'location=yes');
  }

  twitter() {
    window.open("http://www.twitter.com/alienartapps", '_system', 'location=yes');
  }

  linkedIn(){
    window.open("https://www.linkedin.com/company/alien-art/", '_system', 'location=yes');
  }

  instagram(){
    window.open("https://www.instagram.com/alienart.in/", '_system', 'location=yes');
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
