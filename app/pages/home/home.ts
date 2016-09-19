import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PS_Service } from '../../providers/services';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  POT: any;
  PLAYERS: any;
  PLAYING: any;
  dealerID: any;
  smallBlindID: any;
  bigBlindID: any;
  smallBlind: any;
  bigBlind: any;
  currentBet: any;
  pageState: any;
  winner: any;

  constructor(public navCtrl: NavController, private PS_Service: PS_Service) {
    this.PS_Service.get('POT').then(val => {
      this.POT = parseInt(val);
    });
    this.PS_Service.get('PLAYING').then(val => {
      this.PLAYING = parseInt(val);
    });
    this.PS_Service.get('PLAYERS').then(val => {
      console.log(val)
      this.PLAYERS = JSON.parse(val);
      console.log(this.PLAYERS)
    });
    this.PS_Service.get('dealerID').then(val => {
      this.dealerID = parseInt(val);
    });
    this.PS_Service.get('smallBlindID').then(val => {
      this.smallBlindID = parseInt(val);
    });
    this.PS_Service.get('bigBlindID').then(val => {
      this.bigBlindID = parseInt(val);
    });
    this.PS_Service.get('smallBlind').then(val => {
      this.smallBlind = parseInt(val);
    });
    this.PS_Service.get('bigBlind').then(val => {
      this.bigBlind = parseInt(val);
    });
    this.PS_Service.get('currentBet').then(val => {
      this.currentBet = parseInt(val) || 0;
    });
    this.PS_Service.get('pageState').then(val => {
      this.pageState = parseInt(val) || 1;
    });

  }
  ngOnInit() {
    this.pageState = 1;
    setTimeout(() => {
      if (!this.PLAYING) {
        this.PLAYING = this.bigBlindID;
        this.PLAYING = this.getNextPlayer();
        console.log(this.PLAYING, this.bigBlindID)
      }
      this.currentBet = this.bigBlind;
      this.payBlinds();
    }, 100)
  }

  payBlinds() {
    this.PLAYERS[this.smallBlindID - 1].balance -= this.smallBlind;
    this.PLAYERS[this.smallBlindID - 1].paid += this.smallBlind;
    this.PLAYERS[this.bigBlindID - 1].balance -= this.bigBlind;
    this.PLAYERS[this.bigBlindID - 1].paid += this.bigBlind;
    this.POT += this.bigBlind + this.smallBlind;
  }

  getFirstPlayer(isNewRound = false) {
    this.pageState += 1;
    console.log('pageState', this.pageState, 'isNewRound', isNewRound)
    if (this.pageState == 5) this.winner = 'Choose Winner';
    else if (this.pageState > 5) return this.PLAYING;
    if (!isNewRound) this.PLAYING = this.dealerID;
    console.log('isPlaying2', this.PLAYING)
    this.currentBet = 0;
    console.log('all played')
    this.PLAYERS.forEach(player => {
      if (player.state != 'folded') player.state = '';
      if (player.state != 'folded') player.played = false;
      if (player.state != 'folded') player.paid = 0;
    })
    this.PLAYING = this.getNextPlayer();
    console.log('isPlaying3', this.PLAYING)
    return this.PLAYING;
  }

  getNextPlayer() {
    let allPlayed = this.PLAYERS.filter(player => {
      return !player.played;
    }).length == 0;
    if (allPlayed) return this.getFirstPlayer();
    console.log('continue next player')
    let player = this.PLAYING + 1;
    if (player > this.PLAYERS.length) {
      this.PLAYING = 0;
      return this.getNextPlayer();
    }
    if (this.PLAYERS[player - 1].state == 'folded') {
      this.PLAYING += 1;
      return this.getNextPlayer();
    }
    this.PLAYERS.forEach(player => {
      player.active = false;
    })
    this.PLAYERS[player - 1].active = true;
    return player
  }

  raise() {
    console.log('$', this.currentBet)
    let bet = this.currentBet += 5;
    this.currentBet = bet;
    this.PLAYERS[this.PLAYING - 1].balance -= bet;
    if (!this.PLAYERS[this.PLAYING - 1].paid) this.PLAYERS[this.PLAYING - 1].paid = 0;
    this.PLAYERS[this.PLAYING - 1].paid += bet;
    this.PLAYERS[this.PLAYING - 1].state = 'raised';
    this.PLAYERS.forEach(player => {
      player.played = false;
    })
    this.PLAYERS[this.PLAYING - 1].played = true;
    this.POT += bet;

    this.PLAYING = this.getNextPlayer();

  }

  call() {
    let bet = this.currentBet;
    console.log('call', this.PLAYING)
    this.PLAYERS[this.PLAYING - 1].balance -= bet;
    this.PLAYERS[this.PLAYING - 1].state = 'called';
    if (!this.PLAYERS[this.PLAYING - 1].paid) this.PLAYERS[this.PLAYING - 1].paid = 0;
    this.PLAYERS[this.PLAYING - 1].paid += bet;
    this.PLAYERS[this.PLAYING - 1].played = true;
    this.POT += bet;
    this.PLAYING = this.getNextPlayer();
  }

  check() {
    this.PLAYERS[this.PLAYING - 1].state = 'checked';
    this.PLAYERS[this.PLAYING - 1].played = true;
    this.PLAYING = this.getNextPlayer();
  }

  fold() {
    this.PLAYERS[this.PLAYING - 1].state = 'folded';
    this.PLAYERS[this.PLAYING - 1].played = true;
    if (this.PLAYERS.filter(player => {
      return player.state != 'folded';
    }).length == 1) {
      return this.payWinner(this.PLAYERS[this.getNextPlayer() - 1]);
    }
    console.log(this)
    this.PLAYING = this.getNextPlayer();

  }

  next() {
    this.winner = "";
    this.pageState = 0;
    this.currentBet = 0;
    this.POT = 0;
    this.bigBlindID = (this.bigBlindID + 1 <= this.PLAYERS.length) ? this.bigBlindID += 1 : 1;
    this.smallBlindID = (this.smallBlindID + 1 <= this.PLAYERS.length) ? this.smallBlindID += 1 : 1;
    this.dealerID = (this.dealerID + 1 <= this.PLAYERS.length) ? this.dealerID += 1 : 1;
    this.PLAYING = (this.bigBlindID <= this.PLAYERS.length) ? this.bigBlindID : 1;
    this.PLAYING = this.bigBlindID;
    console.log('playing', this.PLAYING)
    this.PLAYERS.forEach(player => {
      player.state = '';
      player.played = false;
      player.paid = 0;
    })
    this.getFirstPlayer(true);
    this.payBlinds()
  }

  payWinner(player) {
    this.winner = player.name;
    player.balance += this.POT;
  }
}
