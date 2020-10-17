import * as Phaser from "phaser";

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export const randomDirection = (exclude?: Direction) => {
    let newDirection = Phaser.Math.Between(0, 3);

    while (newDirection === exclude) {
        newDirection = Phaser.Math.Between(0, 3);
    }

    return newDirection;
};
