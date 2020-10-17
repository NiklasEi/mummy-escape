import {Position} from "../scenes/GameScene";

export const slotToPixels = (position: Position): Position => {
    return {
        x: position.x * 32,
        y: position.y * 32
    }
};

export const slotToCenterInTile = (position: Position): Position => {
    return {
        x: position.x * 32 + 16,
        y: position.y * 32 + 16
    }
};
