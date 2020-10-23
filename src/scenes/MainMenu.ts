import * as Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
  private playButton!: Phaser.GameObjects.Image;

  constructor() {
    super('mainMenu');
  }

  create() {
    this.physics.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'menu');
    this.addControls((this.game.renderer.height * 2) / 3 + 64);
    this.playButton = this.add.image(this.game.renderer.width / 2, (this.game.renderer.height * 2) / 3, 'start-button');
    this.playButton.setInteractive();
    this.playButton.on('pointerdown', () => {
      this.playButton.setTint(0x808080);
    });
    this.playButton.on('pointerup', () => {
      this.scene.start('game');
    });
  }

  private addControls(height: number) {
    this.add.text(this.game.renderer.width / 2 - 106, height + 16, 'move');
    this.add.text(this.game.renderer.width / 2 + 39, height, 'W / ⬆️');
    this.add.text(this.game.renderer.width / 2 - 16, height + 32, 'A / ⬅️    S / ️⬇    D / ➡️');
    this.add.text(this.game.renderer.width / 2 - 106, height + 80, 'shoot');
    this.add.text(this.game.renderer.width / 2 + 39, height + 80, 'space');
  }
}
