import * as Phaser from 'phaser';
import { sceneEvents } from '../events/EventCenter';
import GameObject = Phaser.GameObjects.GameObject;
import { getViewDirection } from '../utils/getViewDirection';
import GameScene from '../scenes/GameScene';

export enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

interface Control {
  W: any;
  A: any;
  S: any;
  D: any;
}

export default class Mummy extends Phaser.Physics.Arcade.Sprite {
  public healthState = HealthState.IDLE;
  private damageTime = 0;
  private _health = 3;
  private _stones = 0;
  private activeStone?: any;
  private dead = false;
  private _torch = false;
  private _slingshot = false;
  private readonly gameScene: GameScene;
  private readonly organs: string[] = [];
  private readonly keys: Control;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.gameScene = scene as GameScene;
    this.anims.play('mummy-idle-down');
    this.keys = scene.input.keyboard.addKeys('W,S,A,D') as Control;
  }

  private shootStone() {
    if (!this._slingshot) return;
    if (!this._stones) return;
    if (!!this.activeStone) return;

    this.activeStone = this.scene.physics.add.image(this.x, this.y, 'stone');
    this._stones = this._stones - 1;
    sceneEvents.emit('collect-stone', this._stones);
    this.activeStone.name = 'thrown stone';
    this.activeStone.scale = 0.3;
    this.activeStone.body.onCollide = true;
    const direction = getViewDirection(this.anims.currentAnim.key.split('-')[2]);
    this.activeStone.setActive(true);
    this.activeStone.setVisible(true);

    this.scene.physics.add.collider(
      this.gameScene.ghosts,
      this.activeStone,
      this.handleStoneEnemyCollision,
      undefined,
      this
    );
    this.scene.physics.add.collider(
      this.gameScene.bats,
      this.activeStone,
      this.handleStoneEnemyCollision,
      undefined,
      this
    );
    this.scene.physics.add.collider(
      this.activeStone,
      this.gameScene.wallsLayer,
      this.handleStoneWallCollision,
      undefined,
      this
    );
    this.scene.physics.add.collider(
      this.activeStone,
      this.gameScene.doorsLayer,
      this.handleStoneWallCollision,
      undefined,
      this
    );

    const speed = direction.scale(200);
    this.activeStone.setVelocity(speed.x, speed.y);
  }

  get health() {
    return this._health;
  }

  get stone() {
    return this.activeStone;
  }

  get torch() {
    return this._torch;
  }

  collectStone(_mummy: GameObject, stone: GameObject) {
    stone.destroy();
    this._stones++;
    sceneEvents.emit('collect-stone', this._stones);
  }

  collectLamp(torch: GameObject, _mummy: GameObject) {
    torch.destroy();
    sceneEvents.emit('better-light');
    this._torch = true;
  }

  collectSlingshot(slingshot: GameObject, _mummy: GameObject) {
    slingshot.destroy();
    sceneEvents.emit('collect-slingshot');
    this._slingshot = true;
  }

  collectOrgans(organ: GameObject, _mummy: GameObject) {
    const organImage = organ as Phaser.GameObjects.Image;
    this.organs.push(organImage.texture.key);
    organ.destroy();
    sceneEvents.emit('collect-organs', this.organs);
  }

  handleStoneWallCollision(obj1: Phaser.GameObjects.GameObject, _: Phaser.GameObjects.GameObject) {
    if (obj1.name === 'thrown stone') {
      obj1.destroy(true);
      this.activeStone = null;
    }
  }

  handleStoneEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    obj1.destroy();
    obj2.destroy();
    this.activeStone = null;
  }

  handleDamage(knockBack?: Phaser.Math.Vector2) {
    if (this.healthState === HealthState.DAMAGE) return;
    this.scene.sound.play('hurt', { loop: false, volume: 1 });

    if (knockBack) {
      this.setVelocity(knockBack.x, knockBack.y);
    } else {
      this.setVelocity(0, 0);
    }

    this.setTint(0xff0000);

    this.healthState = HealthState.DAMAGE;
    this.damageTime = 0;
    this._health = this._health - 1;

    if (this.health <= 0) {
      this.healthState = HealthState.DEAD;
      sceneEvents.emit('mummy-die-start');
    }
  }

  escape(_: Phaser.GameObjects.GameObject, _door: Phaser.GameObjects.GameObject) {
    if (this.organs.length === 4) {
      sceneEvents.emit('won');
    }
    return this.organs.length !== 4;
  }

  preUpdate(t: number, dt: number) {
    if (this.dead) {
      return;
    }
    super.preUpdate(t, dt);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += dt;

        if (this.damageTime >= 250) {
          sceneEvents.emit('mummy-state-idle');
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
      case HealthState.DEAD:
        this.damageTime += dt;

        if (this.damageTime >= 250) {
          this.dead = true;
          this.anims.play('mummy-idle-down');
          sceneEvents.emit('mummy-die-end');
          this.setVelocity(0, 0);
          this.damageTime = 0;
        }
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, vision: Phaser.GameObjects.Image) {
    if (this.healthState === HealthState.DAMAGE || this.healthState === HealthState.DEAD) return;

    // @ts-ignore-next-line
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      if (!this._slingshot) return;
      return this.shootStone();
    }

    const speed = 125;
    if (cursors.left?.isDown || this.keys.A.isDown) {
      this.anims.play('mummy-run-left', true);
      this.setVelocity(-speed, 0);
      vision.setAngle(180);
    } else if (cursors.right?.isDown || this.keys.D.isDown) {
      this.anims.play('mummy-run-right', true);
      this.setVelocity(speed, 0);
      vision.setAngle(0);
    } else if (cursors.up?.isDown || this.keys.W.isDown) {
      this.anims.play('mummy-run-up', true);
      this.setVelocity(0, -speed);
      vision.setAngle(-90);
    } else if (cursors.down?.isDown || this.keys.S.isDown) {
      this.anims.play('mummy-run-down', true);
      this.setVelocity(0, speed);
      vision.setAngle(90);
    } else {
      const parts = this.anims.currentAnim.key.split('-');
      parts[1] = 'idle';
      this.anims.play(parts.join('-'));
      this.setVelocity(0, 0);
    }
  }
}
