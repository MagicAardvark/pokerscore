import { Component, ViewChild } from '@angular/core';
import { Platform, ionicBootstrap, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { CreatePage } from './pages/create/create';
import { HomePage } from './pages/home/home';
import { PS_Service } from './providers/services';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class PokerScore {

  @ViewChild(Nav) nav: Nav;

  public rootPage: any;
  public storage: any;

  constructor(private platform: Platform, private PS_Service: PS_Service) {
    //this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });

    this.PS_Service.get('SESSION').then(session => {
      console.log('session', session)
      if (!session) {
        this.nav.setRoot(CreatePage);
      }
      else {
        this.nav.setRoot(HomePage);
      }
    });
  }
}

ionicBootstrap(PokerScore, [PS_Service]);
