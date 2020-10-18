import Vector2 = Phaser.Math.Vector2;
import * as Phaser from 'phaser';

export const getViewDirection = (direction: string): Vector2 => {
  const vector = new Phaser.Math.Vector2(0, 0);

  switch (direction) {
    case 'up':
      vector.y = -1;
      break;
    case 'down':
      vector.y = 1;
      break;
    case 'left':
      vector.x = -1;
      break;
    case 'right':
      vector.x = 1;
      break;
  }

  return vector;
};
