import * as Phaser from "phaser";

export default class Game extends Phaser.Scene
{
    constructor() {
        super("game");
    }

    preload() {
    }

    create() {
        const map = this.make.tilemap({ key: "pyramid" });
        const tileset = map.addTilesetImage("pyramid", "tiles");

        map.createStaticLayer("Ground", tileset);
        const wallsLayer = map.createStaticLayer("Walls", tileset);

        wallsLayer.setCollisionByProperty({ collides: true })

        const debugGraphics = this.add.graphics().setAlpha(0.7);
        wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });
    }
}


// const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
//   active: false,
//   visible: false,
//   key: 'Game'
// };

  // @ts-ignore-next-line // a bit hacky...
//   private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
//
//   constructor() {
//     super(sceneConfig);
//   }
//
//   public create() {
//     this.square = this.add.rectangle(400, 400, 100, 100, 0xffffff) as any;
//     this.physics.add.existing(this.square);
//   }
//
//   public update() {
//     const cursorKeys = this.input.keyboard.createCursorKeys();
//
//     if (cursorKeys.up !== undefined && cursorKeys.up.isDown) {
//       this.square.body.setVelocityY(-500);
//     } else if (cursorKeys.down !== undefined && cursorKeys.down.isDown) {
//       this.square.body.setVelocityY(500);
//     } else {
//       this.square.body.setVelocityY(0);
//     }
//
//     if (cursorKeys.right !== undefined && cursorKeys.right.isDown) {
//       this.square.body.setVelocityX(500);
//     } else if (cursorKeys.left !== undefined && cursorKeys.left.isDown) {
//       this.square.body.setVelocityX(-500);
//     } else {
//       this.square.body.setVelocityX(0);
//     }
//   }
