import * as Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
  private playButton!: Phaser.GameObjects.Image;

  constructor() {
    super('mainMenu');
  }

  create() {
    this.playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 2 / 3, 'button');
    this.playButton.scale = 2;
    this.playButton.setInteractive();
    const text = this.add.text(this.game.renderer.width / 2 - 45, this.game.renderer.height * 2 / 3 - 15, "START");
    text.scale = 2;

    this.playButton.on('pointerup', () => {
      this.playButton = this.add
        .image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'button-press')
      this.scene.start('game');
    });
  }
}
