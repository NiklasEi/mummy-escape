import * as Phaser from 'phaser';

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super('loadingScene');
  }

  private percent = 0;
  private waitTime = 2000;

  preload() {
    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff
      }
    });


    this.game.time.events.add(Phaser.Time.TimerEvent.SECOND * 4, this.loading, this);
  }

  private loading() {
    console.log(Phaser.Timer.SECOND)

  }
}
