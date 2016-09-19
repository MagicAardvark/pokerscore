import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { PS_Service } from '../../providers/services';

@Component({
  templateUrl: 'build/pages/create/create.html'
})
export class CreatePage {
  game: { username?: string, password?: string } = {};
  submitted = false;
  constructor(public navCtrl: NavController, private PS_Service: PS_Service) {
  }

  onCreate(form) {
    this.submitted = true;
    if (form.valid) {
      this.PS_Service.set('SESSION', true);
      this.PS_Service.set('POT', 0);
      this.PS_Service.set('PLAYERS', JSON.stringify([{
          id: 1,
          balance: 100,
          paid: 0,
          name: 'Kyle'
      }, {
          id: 2,
          balance: 100,
          paid: 0,
          name: 'Arpi'
      }, {
          id: 3,
          balance: 100,
          paid: 0,
          name: 'Ozzy'
      }, {
          id: 4,
          balance: 100,
          paid: 0,
          name: 'Loki'
      }]));
      this.PS_Service.set('dealerID', 1);
      this.PS_Service.set('smallBlindID', 2);
      this.PS_Service.set('bigBlindID', 3);
      this.PS_Service.set('smallBlind', 1);
      this.PS_Service.set('bigBlind', 2);
      this.navCtrl.setRoot(HomePage);
    }
  }
}
